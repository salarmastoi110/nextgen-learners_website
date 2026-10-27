import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, formatDuration } from '../../utils/formatters';

const statusBadge = {
  Open: 'badge--success',
  'Closing Soon': 'badge--warning',
  Closed: 'badge--danger',
};

export default function InternshipCard({ internship }) {
  const {
    id,
    title,
    company,
    type,
    location,
    durationWeeks,
    stipend,
    deadline,
    status,
    icon,
    gradient,
    skills,
    summary,
  } = internship;

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
            <span>🏢 {company}</span>
            <span>📍 {location}</span>
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
            <span>⏳ {formatDuration(durationWeeks)}</span>
            <span>💰 {formatCurrency(stipend)}/mo</span>
            <span>🗓️ {formatDate(deadline)}</span>
          </p>
          <Link className="btn btn--outline btn--sm" to={`/internships/${id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
