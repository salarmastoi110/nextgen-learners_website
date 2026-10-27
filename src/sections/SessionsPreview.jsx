import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import SessionCard from '../components/cards/SessionCard';
import { sessionService } from '../services/sessionService';

/** Upcoming sessions & webinars — pulls real announcements through the service layer. */
export default function SessionsPreview() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    sessionService
      .getAll()
      .then((all) => setSessions((all || []).filter((s) => s.status !== 'Completed').slice(0, 3)))
      .catch(() => setSessions([]));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Live learning"
          title="Upcoming Sessions & Webinars"
          subtitle="Workshops, technical sessions and community events with the NextGen Learners mentors."
        />

        {sessions.length === 0 ? (
          <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
            <div style={{ fontSize: '2.4rem' }} aria-hidden>🎥</div>
            <h3 style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>No sessions announced yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              New webinars and workshops are added regularly — visit the sessions page for the
              latest announcements.
            </p>
            <button className="btn btn--outline" onClick={() => navigate('/sessions')}>
              View All Sessions
            </button>
          </div>
        ) : (
          <>
            <div className="content-grid content-grid--3">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onRegister={() => navigate('/sessions')}
                  registering={false}
                  registered={false}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <button className="btn btn--outline" onClick={() => navigate('/sessions')}>
                View All Sessions →
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
