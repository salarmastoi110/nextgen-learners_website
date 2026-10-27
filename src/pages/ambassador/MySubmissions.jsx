import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

const badge = {
  Submitted: 'badge--info',
  Approved: 'badge--success',
  'Revisions Required': 'badge--warning',
};

export default function MySubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState(null);

  useEffect(() => {
    ambassadorService.getSubmissions(user.email).then(setSubmissions);
  }, [user.email]);

  return (
    <PortalLayout
      title="My Submissions"
      links={ambassadorLinks}
      brandLabel="Ambassador Portal"
      actions={<Link to="/ambassador/submit" className="btn btn--primary btn--sm">New Submission</Link>}
    >
      {!submissions ? (
        <LoadingSpinner label="Loading submissions…" />
      ) : submissions.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="No submissions yet"
          message="Complete a task and submit it for review — approved submissions earn official points."
        >
          <Link to="/ambassador/tasks" className="btn btn--primary btn--sm">See My Tasks</Link>
        </EmptyState>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          {submissions.map((s) => (
            <div key={s.id} className="panel">
              <div className="panel__header">
                <h3 className="panel__title">{s.taskTitle}</h3>
                <span className={`badge ${badge[s.status] || ''}`}>{s.status}</span>
              </div>
              <div className="panel__body">
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{s.description}</p>
                <div className="listing-card__meta" style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                  <span>🗓️ Completed {formatDate(s.completionDate)}</span>
                  <span>📤 Submitted {formatDate(s.submittedAt)}</span>
                  {s.evidenceUrl && (
                    <a href={s.evidenceUrl} target="_blank" rel="noreferrer">🔗 Evidence</a>
                  )}
                  {s.status === 'Approved' && <span>🏆 +{s.pointsAwarded} pts</span>}
                </div>
                {s.reviewFeedback && (
                  <div className="alert alert--info" style={{ marginTop: 'var(--space-4)' }}>
                    🧑‍💼 Reviewer: {s.reviewFeedback}
                  </div>
                )}
                {s.status === 'Revisions Required' && (
                  <Link to={`/ambassador/submit?task=${s.taskId}`} className="btn btn--outline btn--sm" style={{ marginTop: 'var(--space-4)' }}>
                    Resubmit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
