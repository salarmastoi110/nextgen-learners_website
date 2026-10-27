import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const { id, title, category, team, year, icon, gradient, tech, summary } = project;

  return (
    <article className="listing-card">
      <div className="listing-card__media" style={{ background: gradient }}>
        <span aria-hidden>{icon}</span>
        <div className="listing-card__badges">
          <span className="badge badge--dark">{category}</span>
        </div>
      </div>

      <div className="listing-card__body">
        <div>
          <h3 className="listing-card__title">{title}</h3>
          <p className="listing-card__meta">
            <span>👥 {team}</span>
            <span>🗓️ {year}</span>
          </p>
        </div>

        <p className="listing-card__desc">{summary}</p>

        <div className="listing-card__tags">
          {tech.slice(0, 4).map((t) => (
            <span key={t} className="badge">
              {t}
            </span>
          ))}
        </div>

        <div className="listing-card__footer">
          <span className="listing-card__meta">Built by NGL students</span>
          <Link className="btn btn--outline btn--sm" to={`/projects/${id}`}>
            Explore Project
          </Link>
        </div>
      </div>
    </article>
  );
}
