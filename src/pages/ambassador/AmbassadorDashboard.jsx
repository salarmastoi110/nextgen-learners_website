import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import StatCard from '../../components/portal/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { ambassadorAnnouncements } from '../../data/ambassadorContent';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export const submissionBadge = {
  Submitted: 'badge--info',
  Approved: 'badge--success',
  'Revisions Required': 'badge--warning',
};

export default function AmbassadorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () =>
      Promise.all([
        ambassadorService.getTasks(),
        ambassadorService.getSubmissions(user.email),
        ambassadorService.getPoints(user.email),
      ]).then(([tasks, submissions, points]) => setData({ tasks, submissions, points }));
    load();
  }, [user.email]);

  if (!data) {
    return (
      <PortalLayout title="Ambassador Dashboard" links={ambassadorLinks} brandLabel="Ambassador Portal">
        <LoadingSpinner label="Loading your dashboard…" />
      </PortalLayout>
    );
  }

  const { tasks, submissions, points } = data;
  const openTasks = tasks.filter((t) => !submissions.some((s) => s.taskId === t.id));
  const pendingReview = submissions.filter((s) => s.status === 'Submitted');
  const approved = submissions.filter((s) => s.status === 'Approved');
  const nextDeadline = [...openTasks].sort((a, b) => (a.deadline > b.deadline ? 1 : -1))[0];
  const progressPct = tasks.length ? Math.round((approved.length / tasks.length) * 100) : 0;

  return (
    <PortalLayout
      title={`Welcome back, ${user.name?.split(' ')[0]} 🎒`}
      links={ambassadorLinks}
      brandLabel="Ambassador Portal"
      actions={
        <Link to="/ambassador/submit" className="btn btn--primary btn--sm">Submit a Task</Link>
      }
    >
      <div className="stat-grid">
        <StatCard icon="📋" label="Open Tasks" value={openTasks.length} />
        <StatCard icon="🗂️" label="Pending Review" value={pendingReview.length} color="#e0e7ff" iconColor="var(--indigo-700)" />
        <StatCard icon="✅" label="Approved Tasks" value={approved.length} color="#dcfce7" iconColor="#166534" />
        <StatCard icon="🏆" label="Official Points" value={points} color="#fef3c7" iconColor="#92400e" />
      </div>

      <div className="profile-grid">
        <div>
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Assigned tasks</h3>
              <Link to="/ambassador/tasks" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>View all</Link>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {openTasks.length === 0 && (
                <EmptyState icon="📋" title="No open tasks" message="New tasks are created by administrators — check back soon." />
              )}
              {openTasks.slice(0, 4).map((task) => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{task.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                      {task.type} · {task.points} pts · due {formatDate(task.deadline)}
                    </div>
                  </div>
                  <Link to={`/ambassador/submit?task=${task.id}`} className="btn btn--outline btn--sm">Work on it</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Announcements</h3>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-5)' }}>
              {ambassadorAnnouncements.map((a) => (
                <div key={a.title}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{a.title}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{formatDate(a.date)} — {a.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Term progress</h3>
            </div>
            <div className="panel__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Tasks approved</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{progressPct}%</span>
              </div>
              <div className="progress">
                <div className="progress__bar" style={{ width: `${progressPct}%` }} />
              </div>
              {nextDeadline && (
                <p className="form-hint" style={{ marginTop: 'var(--space-4)' }}>
                  ⏰ Next deadline: <strong>{nextDeadline.title}</strong> — {formatDate(nextDeadline.deadline)}
                </p>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Recent submissions</h3>
              <Link to="/ambassador/submissions" className="auth-card__link" style={{ fontSize: 'var(--font-size-sm)' }}>View all</Link>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {submissions.length === 0 && <EmptyState icon="🗂️" title="Nothing submitted yet" />}
              {submissions.slice(0, 4).map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{s.taskTitle}</span>
                  <span className={`badge ${submissionBadge[s.status] || ''}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
