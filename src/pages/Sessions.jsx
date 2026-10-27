import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import SessionCard from '../components/cards/SessionCard';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../context/AuthContext';

export default function Sessions() {
  const [all, setAll] = useState(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [term, setTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [registeringId, setRegisteringId] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(() => new Set());

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    sessionService.getAll().then(setAll).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(''), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  const types = [...new Set((all || []).map((s) => s.type))];
  const statuses = ['Open', 'Upcoming', 'Completed'];

  const results = (all || []).filter(
    (s) =>
      (!term || `${s.title} ${s.topic} ${s.speaker?.name} ${s.skills.join(' ')}`.toLowerCase().includes(term.toLowerCase())) &&
      (!typeFilter || s.type === typeFilter) &&
      (!statusFilter || s.status === statusFilter)
  );

  const handleRegister = async (sessionId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/sessions' } });
      return;
    }
    setRegisteringId(sessionId);
    setError('');
    try {
      await sessionService.register({ sessionId, email: user.email, name: user.name });
      setRegisteredIds((prev) => new Set(prev).add(sessionId));
      const session = (all || []).find((s) => s.id === sessionId);
      setFlash(`You're registered for “${session?.title}”. A calendar invite will be sent to ${user.email}.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Sessions &amp; Webinars</h1>
          <p className="page-hero__subtitle">
            Live workshops, webinars and technical sessions from the NextGen Learners
            mentors — online and on campus.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchBar value={term} onChange={setTerm} placeholder="Search sessions, topics or speakers…" />
            </div>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by event type"
            >
              <option value="">All formats</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {flash && <div className="alert alert--success">✅ {flash}</div>}
          {error && <div className="alert alert--error">⚠️ {error}</div>}

          {!all ? (
            <LoadingSpinner label="Loading sessions…" />
          ) : results.length === 0 ? (
            <EmptyState
              icon="🎥"
              title={all.length === 0 ? 'No sessions announced yet' : 'No sessions match your filters'}
              message={
                all.length === 0
                  ? 'New webinars and workshops are added regularly — check back soon or follow us on social media for announcements.'
                  : 'Try a different keyword or adjust your filters.'
              }
            />
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                Showing {results.length} of {all.length} sessions
              </p>
              <div className="content-grid content-grid--3">
                {results.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onRegister={handleRegister}
                    registering={registeringId === session.id}
                    registered={registeredIds.has(session.id) || (isAuthenticated && sessionService.isRegistered(user.email, session.id))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
