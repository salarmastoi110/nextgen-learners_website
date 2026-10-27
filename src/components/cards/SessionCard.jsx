import { formatDate } from '../../utils/formatters';

const statusBadge = {
  Open: 'badge--success',
  Upcoming: 'badge--info',
  Completed: 'badge--dark',
};

export default function SessionCard({ session, onRegister, registering, registered }) {
  const {
    id,
    type,
    status,
    title,
    topic,
    summary,
    speaker,
    date,
    time,
    durationMins,
    mode,
    registrationDeadline,
    skills,
    icon,
    gradient,
  } = session;

  const canRegister = status !== 'Completed';

  return (
    <article className="listing-card">
      <div className="listing-card__media" style={{ background: gradient }}>
        <span aria-hidden>{icon}</span>
        <div className="listing-card__badges">
          <span className={`badge ${statusBadge[status] || ''}`}>{status}</span>
          <span className="badge badge--dark">{type}</span>
        </div>
      </div>

      <div className="listing-card__body">
        <div>
          <h3 className="listing-card__title">{title}</h3>
          <p className="listing-card__meta">
            <span>🎙️ {speaker?.name}</span>
            <span>🧭 {topic}</span>
          </p>
        </div>

        <p className="listing-card__desc">{summary}</p>

        <div className="listing-card__tags">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="badge">
              {skill}
            </span>
          ))}
        </div>

        <div className="listing-card__footer">
          <p className="listing-card__meta">
            <span>🗓️ {formatDate(date)} · {time}</span>
            <span>⏱️ {durationMins} min</span>
            <span>{mode === 'Online' ? '💻' : '🏫'} {mode}</span>
            {registrationDeadline && status === 'Open' && (
              <span>⏳ Register by {formatDate(registrationDeadline)}</span>
            )}
          </p>

          {canRegister ? (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => onRegister(id)}
              disabled={registering || registered}
            >
              {registered ? '✓ Registered' : registering ? 'Please wait…' : 'Register'}
            </button>
          ) : (
            <span className="badge badge--dark">Completed</span>
          )}
        </div>
      </div>
    </article>
  );
}
