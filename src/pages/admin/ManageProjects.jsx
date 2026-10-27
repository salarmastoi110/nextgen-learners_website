import { useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { adminLinks } from '../../data/portalNavigation';
import { createCatalog } from '../../services/adminCatalog';
import { projects as seedProjects } from '../../data/projects';
import { useSearch } from '../../hooks/useSearch';

const catalog = createCatalog('projects', seedProjects);

const emptyDraft = {
  title: '',
  category: 'Web App',
  team: '',
  members: 3,
  duration: '8 weeks',
  year: new Date().getFullYear(),
  icon: '🛠️',
  gradient: 'linear-gradient(135deg, #0d9488, #4f46e5)',
  summary: '',
};

export default function ManageProjects() {
  const [items, setItems] = useState(() => catalog.load());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const categories = ['All', ...new Set(items.map((p) => p.category))];
  const { term, setTerm, filters, setFilters, results } = useSearch(items, {
    searchFields: ['title', 'team', 'category'],
    filterFn: (p, f) => !f.category || f.category === 'All' || p.category === f.category,
    pageSize: 100,
  });

  const refresh = () => setItems(catalog.load());
  const openCreate = () => { setDraft(emptyDraft); setEditingId(null); setFormOpen(true); };
  const openEdit = (p) => { setDraft({ ...emptyDraft, ...p }); setEditingId(p.id); setFormOpen(true); };
  const setField = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const payload = { ...draft, members: Number(draft.members) || 0, year: Number(draft.year) || new Date().getFullYear() };
    if (editingId) catalog.update(editingId, payload);
    else catalog.add(payload);
    refresh();
    setFormOpen(false);
  };

  const remove = (id) => { if (confirm('Delete this project?')) { catalog.remove(id); refresh(); } };

  return (
    <PortalLayout
      title="Manage Projects"
      links={adminLinks}
      brandLabel="Admin Panel"
      actions={<Button size="sm" onClick={openCreate}>＋ Add Project</Button>}
    >
      {formOpen && (
        <form className="admin-form animate-in" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={draft.title} onChange={setField('title')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={draft.category} onChange={setField('category')} />
          </div>
          <div className="form-group">
            <label className="form-label">Team</label>
            <input className="form-input" value={draft.team} onChange={setField('team')} placeholder="Web Track — Cohort 7" />
          </div>
          <div className="form-group">
            <label className="form-label">Members</label>
            <input className="form-input" type="number" min="1" value={draft.members} onChange={setField('members')} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input className="form-input" value={draft.duration} onChange={setField('duration')} placeholder="10 weeks" />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={draft.year} onChange={setField('year')} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Summary</label>
            <input className="form-input" value={draft.summary} onChange={setField('summary')} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
            <Button type="submit" variant="primary" size="sm">{editingId ? 'Save changes' : 'Create project'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <SearchBar value={term} onChange={setTerm} placeholder="Search projects…" />
        <select className="filter-select" value={filters.category || 'All'} onChange={(e) => setFilters({ category: e.target.value })}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState icon="🛠️" title="No projects found" message="Adjust the filters or showcase a new student project." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Team</th>
                <th>Members</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ width: 34, height: 34, borderRadius: 8, background: p.gradient, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>{p.icon}</span>
                      <div style={{ fontWeight: 700 }}>{p.title}</div>
                    </div>
                  </td>
                  <td><span className="badge">{p.category}</span></td>
                  <td>{p.team}</td>
                  <td>{p.members}</td>
                  <td>{p.year}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(p)}>✏️</button>
                      <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(p.id)}>🗑️</button>
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
