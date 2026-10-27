import { useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { adminLinks } from '../../data/portalNavigation';
import { createCatalog } from '../../services/adminCatalog';
import { courses as seedCourses } from '../../data/courses';
import { COURSE_LEVELS } from '../../utils/constants';
import { useSearch } from '../../hooks/useSearch';
import { formatCurrency } from '../../utils/formatters';

const catalog = createCatalog('courses', seedCourses);
const COURSE_STATUSES = ['Published', 'Draft', 'Archived'];

const emptyDraft = {
  title: '',
  category: 'Web Development',
  level: 'Beginner',
  instructor: '',
  price: 0,
  durationWeeks: 8,
  status: 'Published',
  icon: '📚',
  gradient: 'linear-gradient(135deg, #0d9488, #06b6d4)',
  summary: '',
};

const statusBadge = {
  Published: 'badge--success',
  Draft: 'badge--warning',
  Archived: 'badge--danger',
};

export default function ManageCourses() {
  const [items, setItems] = useState(() => catalog.load());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const { term, setTerm, filters, setFilters, results } = useSearch(items, {
    searchFields: ['title', 'category', 'instructor'],
    filterFn: (c, f) => (!f.level || c.level === f.level) && (!f.status || c.status === f.status),
    pageSize: 100,
  });

  const refresh = () => setItems(catalog.load());
  const openCreate = () => { setDraft(emptyDraft); setEditingId(null); setFormOpen(true); };
  const openEdit = (c) => { setDraft({ ...emptyDraft, ...c }); setEditingId(c.id); setFormOpen(true); };
  const setField = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const payload = { ...draft, price: Number(draft.price) || 0, durationWeeks: Number(draft.durationWeeks) || 0 };
    if (editingId) catalog.update(editingId, payload);
    else catalog.add(payload);
    refresh();
    setFormOpen(false);
  };

  const changeStatus = (id, status) => { catalog.update(id, { status }); refresh(); };
  const remove = (id) => { if (confirm('Delete this course?')) { catalog.remove(id); refresh(); } };

  return (
    <PortalLayout
      title="Manage Courses"
      links={adminLinks}
      brandLabel="Admin Panel"
      actions={<Button size="sm" onClick={openCreate}>＋ Add Course</Button>}
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
            <label className="form-label">Instructor</label>
            <input className="form-input" value={draft.instructor} onChange={setField('instructor')} />
          </div>
          <div className="form-group">
            <label className="form-label">Level</label>
            <select className="form-input" value={draft.level} onChange={setField('level')}>
              {COURSE_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price (PKR)</label>
            <input className="form-input" type="number" min="0" value={draft.price} onChange={setField('price')} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (weeks)</label>
            <input className="form-input" type="number" min="1" value={draft.durationWeeks} onChange={setField('durationWeeks')} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={draft.status} onChange={setField('status')}>
              {COURSE_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
            <Button type="submit" variant="primary" size="sm">{editingId ? 'Save changes' : 'Create course'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <SearchBar value={term} onChange={setTerm} placeholder="Search courses…" />
        <select className="filter-select" value={filters.level || ''} onChange={(e) => setFilters({ level: e.target.value || null })}>
          <option value="">All levels</option>
          {COURSE_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select className="filter-select" value={filters.status || ''} onChange={(e) => setFilters({ status: e.target.value || null })}>
          <option value="">All statuses</option>
          {COURSE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState icon="📚" title="No courses found" message="Adjust the filters or add a new course." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Level</th>
                <th>Price</th>
                <th>Learners</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ width: 34, height: 34, borderRadius: 8, background: c.gradient, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>{c.icon}</span>
                      <div style={{ fontWeight: 700 }}>{c.title}</div>
                    </div>
                  </td>
                  <td>{c.instructor}</td>
                  <td>{c.level}</td>
                  <td>{formatCurrency(c.price)}</td>
                  <td>{c.students?.toLocaleString?.() ?? '—'}</td>
                  <td>
                    <select className="filter-select" value={c.status || 'Published'} onChange={(e) => changeStatus(c.id, e.target.value)}>
                      {COURSE_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(c)}>✏️</button>
                      <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(c.id)}>🗑️</button>
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
