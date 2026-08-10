import { useState } from 'react';
import { muted } from '../lib/format.js';
import { Badge, SheetHeader } from '../components/ui.jsx';

export default function CategoriesScreen({ t }) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    const result = t.addCategory(name);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setFormOpen(false);
    setName('');
    setError('');
  };

  const remove = (catName) => {
    const count = t.categoryUsageCount(catName);
    const msg = count > 0
      ? `"${catName}" is used by ${count} ${count === 1 ? 'entry' : 'entries'}. They'll be moved to "Other" if you delete it. Continue?`
      : `Delete "${catName}"?`;
    if (!window.confirm(msg)) return;
    t.deleteCategory(catName);
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        title="Categories"
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={() => setFormOpen((o) => !o)}>
            + Add
          </button>
        )}
      />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        Used to tag expenses everywhere in the app. &ldquo;Other&rdquo; can&rsquo;t be removed — it&rsquo;s where
        entries land if their category is deleted.
      </div>

      {formOpen && (
        <div className="card elev-sm" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="category-name">Category name</label>
            <input
              id="category-name"
              className="input"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="e.g. Pets"
              autoFocus
            />
          </div>
          {error && <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{error}</div>}
          <button type="button" onClick={save} className="btn btn-primary btn-block" style={{ margin: 0 }}>Save</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {t.data.categories.map((c) => (
          <div key={c.name} className="om-row" style={{ justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}>
            <div className="om-row" style={{ gap: 10 }}>
              <Badge meta={c} />
              <span style={{ fontSize: 13.5 }}>{c.name}</span>
            </div>
            {c.name !== 'Other' && (
              <button
                type="button"
                onClick={() => remove(c.name)}
                className="btn btn-ghost"
                style={{ padding: 0, fontSize: 12 }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
