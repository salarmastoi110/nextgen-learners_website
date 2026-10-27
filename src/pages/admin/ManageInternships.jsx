import { useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { adminLinks } from '../../data/portalNavigation';
import { createCatalog } from '../../services/adminCatalog';
import { internships as seedInternships } from '../../data/internships';
import { INTERNSHIP_TYPES, INTERNSHIP_STATUS } from '../../utils/constants';
import { useSearch } from '../../hooks/useSearch';

const catalog = createCatalog('internships', seedInternships);

const emptyDraft = {
  title: '',
  company: 'NextGen Learners',
  type: 'Remote',
  location: 'Remote (Pakistan)',
  openings: 5,
  status: 'Open',
  icon: '💼',
  gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
  summary: '',
  skills: [],
};

export default function ManageInternships() {
  const [items, setItems] = useState(() => catalog.load());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const { term, setTerm, filters, setFilters, results } = useSearch(items, {
    searchFields: ['title', 'company', 'location'],
    filterFn: (i, f) => !f.status || i.status === f.status,
    pageSize: 100,
  });

  const refresh = () => setItems(catalog.load());

  const openCreate = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setDraft({ ...emptyDraft, ...item });
    setEditingId(item.id);
    setFormOpen(true);
  };

  const setField = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const payload = { ...draft, openings: Number(draft.openings) || 0 };
    if (editingId) catalog.update(editingId, payload);
    else catalog.add(payload);
    refresh();
    setFormOpen(false);
  };

  const changeStatus = (id, status) => {
    catalog.update(id, { status });
    refresh();
  };

  const remove = (id) => {
    if (confirm('Delete this internship?')) {
      catalog.remove(id);
      refresh();
    }
  };

  return (
    <PortalLayout
      title="Manage Internships"
      links={adminLinks}
      brandLabel="Admin Panel"
      actions={<Button size="sm" onClick={openCreate}>＋ Add Internship</Button>}
    >
      {formOpen && (
        <form className="admin-form animate-in" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={draft.title} onChange={setField('title')} placeholder="Web Development Intern" required />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" value={draft.company} onChange={setField('company')} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={draft.type} onChange={setField('type')}>
              {INTERNSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={draft.location} onChange={setField('location')} />
          </div>
          <div className="form-group">
            <label className="form-label">Openings</label>
            <input className="form-input" type="number" min="1" value={draft.openings} onChange={setField('openings')} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={draft.status} onChange={setField('status')}>
              {INTERNSHIP_STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Short summary</label>
            <input className="form-input" value={draft.summary} onChange={setField('summary')} placeholder="One-line description shown on the card." />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
            <Button type="submit" variant="primary" size="sm">{editingId ? 'Save changes' : 'Create internship'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <SearchBar value={term} onChange={setTerm} placeholder="Search internships…" />
        <select className="filter-select" value={filters.status || ''} onChange={(e) => setFilters({ status: e.target.value || null })}>
          <option value="">All statuses</option>
          {INTERNSHIP_STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState icon="💼" title="No internships found" message="Try adjusting your search or add a new listing." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Company</th>
                <th>Type</th>
                <th>Openings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ width: 34, height: 34, borderRadius: 8, background: i.gradient, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>{i.icon}</span>
                      <div style={{ fontWeight: 700 }}>{i.title}</div>
                    </div>
                  </td>
                  <td>{i.company}</td>
                  <td>{i.type}</td>
                  <td>{i.openings}</td>
                  <td>
                    <select className="filter-select" value={i.status} onChange={(e) => changeStatus(i.id, e.target.value)}>
                      {INTERNSHIP_STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(i)}>✏️</button>
                      <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(i.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalLayout>
  );
}
