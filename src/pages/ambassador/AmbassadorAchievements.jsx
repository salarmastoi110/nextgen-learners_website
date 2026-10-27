import { useEffect, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ambassadorLinks } from '../../data/portalNavigation';
import { ambassadorService } from '../../services/ambassadorService';
import { ambassadorAchievements } from '../../data/ambassadorContent';
import { useAuth } from '../../context/AuthContext';

/** Achievements are computed only from admin-approved submissions. */
export default function AmbassadorAchievements() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([ambassadorService.getSubmissions(user.email), ambassadorService.getPoints(user.email)])
      .then(([submissions, points]) =>
        setStats({
          points,
          approvedTasks: submissions.filter((s) => s.status === 'Approved').length,
        })
      );
  }, [user.email]);

  return (
    <PortalLayout title="Achievements" links={ambassadorLinks} brandLabel="Ambassador Portal">
      {!stats ? (
        <LoadingSpinner label="Loading achievements…" />
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
            Badges unlock from genuine, admin-approved work — currently{' '}
            <strong>{stats.approvedTasks} approved tasks</strong> and <strong>{stats.points} points</strong>.
          </p>
          <div className="content-grid content-grid--3">
            {ambassadorAchievements.map((a) => {
              const value = a.metric === 'points' ? stats.points : stats.approvedTasks;
              const earned = value >= a.threshold;
              return (
                <div
                  key={a.id}
                  className="panel"
                  style={earned ? { borderColor: 'var(--color-primary)' } : { opacity: 0.65 }}
                >
                  <div className="panel__body" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.4rem' }} aria-hidden>{earned ? a.icon : '🔒'}</div>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: 'var(--space-3)' }}>
                      {a.title}
                    </div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 var(--space-4)' }}>
                      {a.desc}
                    </p>
                    <div className="progress">
                      <div className="progress__bar" style={{ width: `${Math.min(100, Math.round((value / a.threshold) * 100))}%` }} />
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                      {earned ? '✓ Earned' : `${value} / ${a.threshold}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </PortalLayout>
  );
}
