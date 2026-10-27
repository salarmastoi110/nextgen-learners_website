import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { adminLinks } from '../../data/portalNavigation';
import { certificateService } from '../../services/certificateService';
import { useSearch } from '../../hooks/useSearch';
import { formatDate } from '../../utils/formatters';

const statusBadge = { Valid: 'badge--success', Revoked: 'badge--danger' };

export default function ManageCertificates() {
  const [certs, setCerts] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState({ holder: '', courseTitle: '' });
  const [busy, setBusy] = useState(false);

  const load = () => certificateService.getAll().then(setCerts);

  useEffect(() => { load(); }, []);

  const { term, setTerm, filters, setFilters, results } = useSearch(certs || [], {
    searchFields: ['holder', 'courseTitle', 'code'],
    filterFn: (c, f) => !f.status || c.status === f.status,
    pageSize: 100,
  });

  const issue = async (e) => {
    e.preventDefault();
    if (!draft.holder.trim() || !draft.courseTitle.trim()) return;
    setBusy(true);
    await certificateService.issue(draft);
    await load();
    setBusy(false);
    setDraft({ holder: '', courseTitle: '' });
    setFormOpen(false);
  };

  const toggleStatus = async (code, status) => {
    await certificateService.setStatus(code, status);
    await load();
  };

  return (
    <PortalLayout
      title="Manage Certificates"
      links={adminLinks}
      brandLabel="Admin Panel"
      actions={<Button size="sm" onClick={() => setFormOpen((o) => !o)}>＋ Issue Certificate</Button>}
    >
      {formOpen && (
        <form className="admin-form animate-in" onSubmit={issue}>
          <div className="form-group">
            <label className="form-label">Holder name</label>
            <input className="form-input" value={draft.holder} onChange={(e) => setDraft((d) => ({ ...d, holder: e.target.value }))} placeholder="Ayesha Khan" required />
          </div>
          <div className="form-group">
            <label className="form-label">Course / program</label>
            <input className="form-input" value={draft.courseTitle} onChange={(e) => setDraft((d) => ({ ...d, courseTitle: e.target.value }))} placeholder="Modern Web Development with React" required />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <Button type="submit" variant="primary" size="sm" disabled={busy}>{busy ? 'Issuing…' : 'Issue'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <SearchBar value={term} onChange={setTerm} placeholder="Search by holder, course or code…" />
        <select className="filter-select" value={filters.status || ''} onChange={(e) => setFilters({ status: e.target.value || null })}>
          <option value="">All statuses</option>
          <option value="Valid">Valid</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>

      {!certs ? (
        <LoadingSpinner label="Loading certificates…" />
      ) : results.length === 0 ? (
        <EmptyState icon="🏅" title="No certificates found" message="Issue a certificate to get started." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Holder</th>
                <th>Course</th>
                <th>Issued</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.code}>
                  <td><code style={{ fontWeight: 700 }}>{c.code}</code></td>
                  <td style={{ fontWeight: 600 }}>{c.holder}</td>
                  <td>{c.courseTitle}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(c.issuedAt)}</td>
                  <td><span className={`badge ${statusBadge[c.status]}`}>{c.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/verify-certificate?code=${c.code}`} className="icon-btn" title="Verify" aria-label="Verify">🔗</Link>
                      <button
                        className={`icon-btn ${c.status === 'Valid' ? 'icon-btn--danger' : ''}`}
                        title={c.status === 'Valid' ? 'Revoke' : 'Reinstate'}
                        onClick={() => toggleStatus(c.code, c.status === 'Valid' ? 'Revoked' : 'Valid')}
                      >
                        {c.status === 'Valid' ? '⛔' : '♻️'}
                      </button>
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
