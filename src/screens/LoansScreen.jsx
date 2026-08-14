import { useState } from 'react';
import { inr, muted } from '../lib/format.js';
import { Bar, Eyebrow, Seg, SheetHeader } from '../components/ui.jsx';

function IouRow({ i, onMarkRepaid }) {
  const pending = i.status === 'pending';
  const statusBg = pending ? 'var(--color-accent-200)' : 'var(--color-accent-2-100)';
  const statusFg = pending ? 'var(--color-accent-800)' : 'var(--color-accent-2-800)';
  return (
    <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{i.person}</div>
        <div style={{ fontSize: 11, color: muted(55) }}>{i.note ? `${i.note} · ` : ''}{i.date}</div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{inr(i.amount)}</div>
        {pending ? (
          <button
            type="button"
            className="tag"
            onClick={() => onMarkRepaid(i.id)}
            title="Mark as repaid"
            style={{ background: statusBg, color: statusFg, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >Pending</button>
        ) : (
          <span className="tag" style={{ background: statusBg, color: statusFg }}>Repaid</span>
        )}
      </div>
    </div>
  );
}

export default function LoansScreen({ t }) {
  const loans = t.data.loans;

  const [loanFormOpen, setLoanFormOpen] = useState(false);
  const [loanName, setLoanName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [roi, setRoi] = useState('');
  const [emi, setEmi] = useState('');
  const [tenureLeft, setTenureLeft] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loanError, setLoanError] = useState('');

  const [iouFormOpen, setIouFormOpen] = useState(false);
  const [direction, setDirection] = useState('lent');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [iouError, setIouError] = useState('');

  const ious = t.data.ious;
  const lent = ious.filter((i) => i.direction === 'lent');
  const borrowed = ious.filter((i) => i.direction === 'borrowed');
  const pendingSum = (list) => list.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const saveLoan = () => {
    if (!t.addLoan({ name: loanName, principal, outstanding, roi, emi, tenureLeft, dueDate })) {
      setLoanError('Name, principal, outstanding, interest rate and EMI are all required.');
      return;
    }
    setLoanFormOpen(false);
    setLoanName(''); setPrincipal(''); setOutstanding(''); setRoi(''); setEmi(''); setTenureLeft(''); setDueDate(''); setLoanError('');
  };

  const saveIou = () => {
    if (!t.addIou({ direction, person, amount, note })) {
      setIouError('A name and an amount are required.');
      return;
    }
    setIouFormOpen(false);
    setPerson(''); setAmount(''); setNote(''); setIouError('');
  };

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title="Loans & lending" />

      <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <Eyebrow style={{ marginBottom: 0 }}>Loans</Eyebrow>
        <button type="button" onClick={() => setLoanFormOpen((o) => !o)} className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }}>+ Add</button>
      </div>

      {loanFormOpen && (
        <div className="card elev-sm" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="loan-name">Loan name</label>
            <input id="loan-name" className="input" value={loanName} onChange={(e) => { setLoanName(e.target.value); setLoanError(''); }} placeholder="e.g. Home Loan — SBI" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-principal">Principal (₹)</label>
              <input id="loan-principal" type="number" min="1" className="input" value={principal} onChange={(e) => { setPrincipal(e.target.value); setLoanError(''); }} placeholder="2500000" />
            </div>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-outstanding">Outstanding (₹)</label>
              <input id="loan-outstanding" type="number" min="1" className="input" value={outstanding} onChange={(e) => { setOutstanding(e.target.value); setLoanError(''); }} placeholder="1870000" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-roi">Interest rate (%)</label>
              <input id="loan-roi" type="number" min="0" step="0.01" className="input" value={roi} onChange={(e) => { setRoi(e.target.value); setLoanError(''); }} placeholder="8.6" />
            </div>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-emi">EMI (₹/mo)</label>
              <input id="loan-emi" type="number" min="1" className="input" value={emi} onChange={(e) => { setEmi(e.target.value); setLoanError(''); }} placeholder="21500" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-tenure">Tenure left</label>
              <input id="loan-tenure" className="input" value={tenureLeft} onChange={(e) => setTenureLeft(e.target.value)} placeholder="9 yrs 4 mo" />
            </div>
            <div className="field" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="loan-due">Next due</label>
              <input id="loan-due" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Aug 5" />
            </div>
          </div>
          {loanError && <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{loanError}</div>}
          <button type="button" onClick={saveLoan} className="btn btn-primary btn-block" style={{ margin: 0 }}>Save</button>
        </div>
      )}

      {loans.length > 0 && (
        <div className="card elev-md" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <div className="card-kicker">Total outstanding · monthly EMI</div>
          <div className="om-row" style={{ justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>
              {inr(loans.reduce((s, l) => s + l.outstanding, 0))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {inr(loans.reduce((s, l) => s + l.emi, 0))}/mo
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {loans.length === 0 && !loanFormOpen && (
          <div style={{ fontSize: 12.5, color: muted(55) }}>No loans yet — tap + Add to log one.</div>
        )}
        {loans.map((l) => {
          const paidPct = Math.round(((l.principal - l.outstanding) / l.principal) * 100);
          return (
            <div key={l.id} className="card elev-sm" style={{ gap: 'var(--space-2)' }}>
              <div className="om-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div className="card-title" style={{ minWidth: 0 }}>{l.name}</div>
                <span className="tag tag-accent" style={{ flexShrink: 0 }}>{l.roi}% ROI</span>
              </div>
              <Bar pct={paidPct} color="var(--color-accent-2-500)" />
              <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11.5, color: muted(60) }}>
                <span>{inr(l.outstanding)} left of {inr(l.principal)}</span>
                <span>{paidPct}% paid</span>
              </div>
              <div className="hr" style={{ margin: '2px 0' }} />
              <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11.5 }}>
                <div><div style={{ opacity: 0.6 }}>EMI</div><div style={{ fontWeight: 600, marginTop: 2 }}>{inr(l.emi)}</div></div>
                <div><div style={{ opacity: 0.6 }}>Next due</div><div style={{ fontWeight: 600, marginTop: 2 }}>{l.dueDate || '—'}</div></div>
                <div><div style={{ opacity: 0.6 }}>Tenure left</div><div style={{ fontWeight: 600, marginTop: 2 }}>{l.tenureLeft || '—'}</div></div>
              </div>
              <button type="button" onClick={() => t.deleteLoan(l.id)} className="btn btn-ghost" style={{ marginTop: 2, padding: 6, fontSize: 12 }}>Remove</button>
            </div>
          );
        })}
      </div>

      <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="om-eyebrow" style={{ marginBottom: 0 }}>Money with friends &amp; family</div>
        <button type="button" onClick={() => setIouFormOpen((o) => !o)} className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }}>+ Add</button>
      </div>

      {iouFormOpen && (
        <div className="card elev-sm" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <Seg
            name="iouDirection"
            value={direction}
            onChange={setDirection}
            options={[
              { value: 'lent', label: 'I lent' },
              { value: 'borrowed', label: 'I borrowed' },
            ]}
          />
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="iou-person">Person</label>
            <input id="iou-person" className="input" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="e.g. Arjun (friend)" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="iou-amount">Amount</label>
            <input id="iou-amount" className="input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="iou-note">Note (optional)</label>
            <input id="iou-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's it for?" />
          </div>
          {iouError && <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{iouError}</div>}
          <button type="button" onClick={saveIou} className="btn btn-primary btn-block" style={{ margin: 0 }}>Save</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-4)' }}>
        <div className="card elev-sm" style={{ flex: 1, gap: 2 }}>
          <div className="card-kicker">Owed to you</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--color-accent-2-700)' }}>{inr(pendingSum(lent))}</div>
        </div>
        <div className="card elev-sm" style={{ flex: 1, gap: 2 }}>
          <div className="card-kicker">You owe</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--color-accent-700)' }}>{inr(pendingSum(borrowed))}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>You lent</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-4)' }}>
        {lent.length === 0 && <div style={{ fontSize: 12, color: muted(55) }}>Nothing lent out.</div>}
        {lent.map((i) => <IouRow key={i.id} i={i} onMarkRepaid={t.markIouRepaid} />)}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>You borrowed</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {borrowed.length === 0 && <div style={{ fontSize: 12, color: muted(55) }}>Nothing borrowed.</div>}
        {borrowed.map((i) => <IouRow key={i.id} i={i} onMarkRepaid={t.markIouRepaid} />)}
      </div>
    </div>
  );
}
