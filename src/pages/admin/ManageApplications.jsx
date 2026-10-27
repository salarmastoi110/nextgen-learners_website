import { useEffect, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { adminLinks } from '../../data/portalNavigation';
import { applicationService } from '../../services/applicationService';
import { onApplicationsUpdated } from '../../services/events';
import { useSearch } from '../../hooks/useSearch';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const statusBadge = {
  Submitted: 'badge--info',
  'Under Review': 'badge--warning',
  Shortlisted: 'badge--primary',
  Selected: 'badge--success',
  Rejected: 'badge--danger',
};

export default function ManageApplications() {
  const [applications, setApplications] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = () => applicationService.getAll().then(setApplications);

  useEffect(() => {
    load();
    return onApplicationsUpdated(load);
  }, []);

  const { term, setTerm, filters, setFilters, page, setPage, results, total, totalPages } =
    useSearch(applications || [], {
      searchFields: ['applicantName', 'email', 'internshipTitle'],
      filterFn: (a, f) => !f.status || a.status === f.status,
      pageSize: 8,
    });

  const changeStatus = (id, status) => applicationService.updateStatus(id, status);
  const remove = (id) => {
    if (confirm('Delete this application? This cannot be undone.')) applicationService.remove(id);
  };

  return (
    <PortalLayout title="Manage Applications" links={adminLinks} brandLabel="Admin Panel">
      {!applications ? (
        <LoadingSpinner label="Loading applications…" />
      ) : applications.length === 0 ? (
        <EmptyState icon="📄" title="No applications yet" message="Internship applications from students will appear here." />
      ) : (
        <>
          <div className="admin-toolbar">
            <SearchBar value={term} onChange={setTerm} placeholder="Search applicant, email or role…" />
            <select
              className="filter-select"
              value={filters.status || ''}
              onChange={(e) => setFilters({ status: e.target.value || null })}
            >
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Role</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{a.applicantName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{a.email}</div>
                    </td>
                    <td>{a.internshipTitle}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{formatDate(a.appliedAt)}</td>
                    <td>
                      <select
                        className="filter-select"
                        value={a.status}
                        onChange={(e) => changeStatus(a.id, e.target.value)}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="View cover letter" onClick={() => setExpanded(expanded?.id === a.id ? null : a)}>👁️</button>
                        <Button variant="danger" size="sm" onClick={() => remove(a.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {expanded && (
            <div className="panel animate-in" style={{ marginTop: 'var(--space-5)' }}>
              <div className="panel__header">
                <h3 className="panel__title">Cover letter — {expanded.applicantName}</h3>
                <span className={`badge ${statusBadge[expanded.status]}`}>{expanded.status}</span>
              </div>
              <div className="panel__body">
                <p style={{ color: 'var(--text-secondary)' }}>{expanded.coverLetter}</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              Showing {results.length} of {total} applications
            </span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </PortalLayout>
  );
}
