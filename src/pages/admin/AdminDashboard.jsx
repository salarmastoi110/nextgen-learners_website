import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import StatCard from '../../components/portal/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminLinks } from '../../data/portalNavigation';
import { internshipService } from '../../services/internshipService';
import { applicationService } from '../../services/applicationService';
import { courseService } from '../../services/courseService';
import { certificateService } from '../../services/certificateService';
import { readMessages } from '../../services/messages';
import { onApplicationsUpdated } from '../../services/events';
import { timeAgo } from '../../utils/formatters';

const statusBadge = {
  Submitted: 'badge--info',
  'Under Review': 'badge--warning',
  Shortlisted: 'badge--primary',
  Selected: 'badge--success',
  Rejected: 'badge--danger',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => {
      Promise.all([
        internshipService.getAll(),
        applicationService.getAll(),
        courseService.getAll(),
        certificateService.getAll(),
        Promise.resolve(readMessages()),
      ]).then(([internships, applications, courses, certificates, messages]) =>
        setData({ internships, applications, courses, certificates, messages })
      );
    };
    load();
    return onApplicationsUpdated(load);
  }, []);

  if (!data) {
    return (
      <PortalLayout title="Admin Dashboard" links={adminLinks} brandLabel="Admin Panel">
        <LoadingSpinner label="Loading platform overview…" />
      </PortalLayout>
    );
  }

  const { internships, applications, courses, certificates, messages } = data;
  const students = new Set(applications.map((a) => a.email)).size;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingApps = applications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review').length;

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 6);

  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <PortalLayout title="Admin Dashboard" links={adminLinks} brandLabel="Admin Panel">
      <div className="stat-grid">
        <StatCard icon="💼" label="Active Internships" value={internships.length} color="var(--teal-100)" iconColor="var(--teal-700)" />
        <StatCard icon="📄" label="Applications" value={applications.length} trend={`+${pendingApps} pending`} color="var(--indigo-100)" iconColor="var(--indigo-700)" />
        <StatCard icon="🎓" label="Students" value={students} color="var(--amber-100, #fef3c7)" iconColor="#92400e" />
        <StatCard icon="✉️" label="Unread Messages" value={unreadMessages} color="#fee2e2" iconColor="#991b1b" />
      </div>

      <div className="content-grid content-grid--2" style={{ alignItems: 'start', marginTop: 'var(--space-6)' }}>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel__header">
            <h3 className="panel__title">Recent Applications</h3>
            <Link to="/admin/applications" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>
              View all →
            </Link>
          </div>
          <div className="panel__body" style={{ padding: 0 }}>
            <div className="table-wrap" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{a.applicantName}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{a.email}</div>
                      </td>
                      <td>{a.internshipTitle}</td>
                      <td>
                        <span className={`badge ${statusBadge[a.status]}`}>{a.status}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{timeAgo(a.appliedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel__header">
              <h3 className="panel__title">Application Pipeline</h3>
            </div>
            <div className="panel__body">
              {Object.entries(statusCounts).map(([status, count]) => {
                const pct = Math.round((count / applications.length) * 100);
                return (
                  <div key={status} style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{status}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel__header">
              <h3 className="panel__title">Platform Snapshot</h3>
            </div>
            <div className="panel__body">
              <div className="admin-snapshot">
                <div><strong>{courses.length}</strong><span>Courses</span></div>
                <div><strong>{certificates.length}</strong><span>Certificates issued</span></div>
                <div><strong>{messages.length}</strong><span>Total messages</span></div>
                <div><strong>{internships.filter((i) => i.status === 'Open').length}</strong><span>Open roles</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
