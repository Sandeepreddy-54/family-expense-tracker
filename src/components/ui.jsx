import { muted } from '../lib/format.js';

/**
 * Organic's segmented control. The radios stay in the accessibility tree and
 * keep focus (the stylesheet hides them with position/opacity, not display),
 * so `.seg-opt:has(input:focus-visible)` can draw the accent focus ring.
 */
export function Seg({ name, value, onChange, options, style }) {
  return (
    <div className="seg" style={{ width: '100%', ...style }}>
      {options.map((o) => (
        <label key={o.value} className="seg-opt" style={{ flex: 1, justifyContent: 'center' }}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** Progress bar — the `.om-bar-track` / `.om-bar-fill` pair. */
export function Bar({ pct, color }) {
  return (
    <div className="om-bar-track">
      <div className="om-bar-fill" style={{ width: `${Math.max(0, Math.min(pct, 100))}%`, background: color }} />
    </div>
  );
}

/** Round category chip with its initial. */
export function Badge({ meta, size = 22, font = 10 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: meta.bg, color: meta.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: font, fontWeight: 700, flexShrink: 0,
    }}>{meta.letter}</div>
  );
}

export function Chevron({ color = 'var(--color-text)', opacity = 0.35 }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
      <path d="M1 1l6 6-6 6" stroke={color} strokeOpacity={opacity} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Eyebrow({ children, style }) {
  return <div className="om-eyebrow" style={style}>{children}</div>;
}

export function SectionHeading({ children, action }) {
  return (
    <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
      <h3 style={{ fontSize: 14, margin: 0 }}>{children}</h3>
      {action}
    </div>
  );
}

/** Header row shared by every pushed screen. */
export function SheetHeader({ onBack, backLabel = 'Back', title, action }) {
  return (
    <div className="om-sheet-head">
      <button type="button" className="om-sheet-action" onClick={onBack}>{backLabel}</button>
      <h3>{title}</h3>
      {action || <div className="om-sheet-spacer" />}
    </div>
  );
}

/** Pill switch. Two sizes, matching the two used across Settings. */
export function Toggle({ on, onClick, label, small = false }) {
  const w = small ? 40 : 44;
  const h = small ? 24 : 26;
  const knob = small ? 20 : 22;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      style={{
        width: w, height: h, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? 'var(--color-accent)' : 'var(--color-neutral-300)',
        position: 'relative', flexShrink: 0, padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? w - knob - 2 : 2,
        width: knob, height: knob, borderRadius: 999, background: '#fff', transition: 'left .15s',
      }} />
    </button>
  );
}

/** A settings/menu row that pushes a screen. */
export function NavCard({ title, subtitle, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'none', font: 'inherit' }}>
      <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: muted(55) }}>{subtitle}</div>
        </div>
        <Chevron />
      </div>
    </button>
  );
}

/** One transaction row, shared by Home, Activity and the card detail screen. */
export function TxRow({ tx, onDelete, showDelete = false }) {
  return (
    <div className="om-row" style={{ justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)', gap: 8 }}>
      <div className="om-row" style={{ gap: 10, minWidth: 0 }}>
        <Badge meta={tx} size={30} font={11} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.merchant}</div>
          <div style={{ fontSize: 11, color: muted(55) }}>{tx.subLabel}</div>
        </div>
      </div>
      <div className="om-row" style={{ gap: 8, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: tx.amountColor }}>{tx.amountLabel}</div>
          <div style={{ fontSize: 10, color: 'var(--color-accent-700)' }}>{tx.sourceLabel}</div>
        </div>
        {showDelete && tx.canDelete && (
          <button
            type="button"
            onClick={() => onDelete(tx.id)}
            aria-label={`Delete ${tx.merchant}`}
            style={{
              width: 24, height: 24, flexShrink: 0, borderRadius: 999, border: 'none',
              background: 'var(--color-neutral-200)', color: 'var(--color-text)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, lineHeight: 1,
            }}
          >×</button>
        )}
      </div>
    </div>
  );
}
