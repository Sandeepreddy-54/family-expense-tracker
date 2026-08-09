// Minimal single-user SMS relay: MacroDroid POSTs a matching bank/PhonePe
// text here, the app fetches whatever's waiting and clears it. No accounts,
// no database — just a token-gated mailbox in Workers KV. Parsing stays
// entirely client-side (src/lib/smsParser.js), so a captured message is
// treated identically to one pasted into the existing Import screen.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
  });

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Both sides hash to a fixed-length hex digest first, so a token of the
// wrong length can't itself leak timing information.
async function hasValidToken(request, env) {
  const token = request.headers.get('x-relay-token') || '';
  const [got, want] = await Promise.all([sha256Hex(token), sha256Hex(env.RELAY_TOKEN || '')]);
  return got === want;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,POST,OPTIONS',
          'access-control-allow-headers': 'content-type,x-relay-token',
        },
      });
    }

    if (!(await hasValidToken(request, env))) {
      return json({ error: 'Invalid relay token' }, 401);
    }

    if (url.pathname === '/ingest' && request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body || !body.message) return json({ error: 'message is required' }, 400);
      const id = crypto.randomUUID();
      const record = {
        id,
        sender: body.sender || '',
        message: body.message,
        receivedAt: body.receivedAt || new Date().toISOString(),
      };
      await env.SMS_RELAY_KV.put(`msg:${id}`, JSON.stringify(record));
      return json({ ok: true, id });
    }

    if (url.pathname === '/pending' && request.method === 'GET') {
      const list = await env.SMS_RELAY_KV.list({ prefix: 'msg:' });
      const values = await Promise.all(list.keys.map((k) => env.SMS_RELAY_KV.get(k.name)));
      return json({ items: values.filter(Boolean).map((v) => JSON.parse(v)) });
    }

    if (url.pathname === '/ack' && request.method === 'POST') {
      const body = await request.json().catch(() => null);
      const ids = Array.isArray(body?.ids) ? body.ids : [];
      await Promise.all(ids.map((id) => env.SMS_RELAY_KV.delete(`msg:${id}`)));
      return json({ ok: true, removed: ids.length });
    }

    return json({ error: 'Not found' }, 404);
  },
};
