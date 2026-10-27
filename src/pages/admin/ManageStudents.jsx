import { useEffect, useMemo, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import SearchBar from '../../components/common/SearchBar';
import StatCard from '../../components/portal/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { adminLinks } from '../../data/portalNavigation';
import { applicationService } from '../../services/applicationService';
import { onApplicationsUpdated } from '../../services/events';
import { useSearch } from '../../hooks/useSearch';
import { initials } from '../../utils/formatters';

export default function ManageStudents() {
  const [applications, setApplications] = useState(null);

  const load = () => applicationService.getAll().then(setApplications);

  useEffect(() => {
    load();
    return onApplicationsUpdated(load);
  }, []);

  // Build a unique student roster from application records.
  const students = useMemo(() => {
    if (!applications) return [];
    const byEmail = new Map();
    for (const a of applications) {
      const entry = byEmail.get(a.email) || { name: a.applicantName, email: a.email, applications: 0, statuses: [] };
      entry.applications += 1;
      entry.statuses.push(a.status);
      byEmail.set(a.email, entry);
    }
    return [...byEmail.values()];
  }, [applications]);

  const { term, setTerm, results } = useSearch(students, {
    searchFields: ['name', 'email'],
    pageSize: 100,
  });

  return (
    <PortalLayout title="Manage Students" links={adminLinks} brandLabel="Admin Panel">
      {!applications ? (
        <LoadingSpinner label="Loading students…" />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard icon="🎓" label="Registered Students" value={students.length} color="var(--teal-100)" iconColor="var(--teal-700)" />
            <StatCard icon="📄" label="Total Applications" value={applications.length} color="var(--indigo-100)" iconColor="var(--indigo-700)" />
            <StatCard icon="⭐" label="Selected Learners" value={applications.filter((a) => a.status === 'Selected').length} color="#dcfce7" iconColor="#166534" />
          </div>

          <div className="admin-toolbar">
            <SearchBar value={term} onChange={setTerm} placeholder="Search students by name or email…" />
          </div>

          {results.length === 0 ? (
            <EmptyState icon="🎓" title="No students found" message="Students appear here once they apply to an internship." />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Applications</th>
                    <th>Latest Stages</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((s) => (
                    <tr key={s.email}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span className="avatar">{initials(s.name)}</span>
                          <span style={{ fontWeight: 700 }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                      <td>{s.applications}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {s.statuses.map((st, idx) => (
                            <span key={idx} className="badge">{st}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
}
