import { useEffect, useState } from 'react';
import PortalLayout from '../../components/layout/PortalLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ambassadorLinks } from '../../data/portalNavigation';
import { sessionService } from '../../services/sessionService';
import { formatDate } from '../../utils/formatters';

/** Events tab — the same announced sessions, framed for ambassadors as promotion material. */
export default function AmbassadorEvents() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    sessionService.getAll().then(setEvents).catch(() => setEvents([]));
  }, []);

  const upcoming = (events || []).filter((e) => e.status !== 'Completed');
  const past = (events || []).filter((e) => e.status === 'Completed');

  const row = (e) => (
    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', alignItems: 'center' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
          <span aria-hidden>{e.icon}</span> {e.title}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          {e.type} · {formatDate(e.date)} · {e.mode}
        </div>
      </div>
      <span className={`badge ${e.status === 'Open' ? 'badge--success' : e.status === 'Upcoming' ? 'badge--info' : 'badge--dark'}`}>
        {e.status}
      </span>
    </div>
  );

  return (
    <PortalLayout title="Events" links={ambassadorLinks} brandLabel="Ambassador Portal">
      {!events ? (
        <LoadingSpinner label="Loading events…" />
      ) : events.length === 0 ? (
        <EmptyState
          icon="🎥"
          title="No events announced yet"
          message="When new webinars or workshops are announced they appear here and on the public Sessions page."
        />
      ) : (
        <div className="profile-grid">
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Upcoming — promote these!</h3>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-5)' }}>
              {upcoming.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nothing upcoming right now.</p>}
              {upcoming.map(row)}
            </div>
          </div>
          <div className="panel">
            <div className="panel__header">
              <h3 className="panel__title">Completed events</h3>
            </div>
            <div className="panel__body" style={{ display: 'grid', gap: 'var(--space-5)' }}>
              {past.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No past events yet.</p>}
              {past.map(row)}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
