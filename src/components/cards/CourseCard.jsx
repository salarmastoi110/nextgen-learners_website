import { Link } from 'react-router-dom';
import { formatCurrency, formatDuration } from '../../utils/formatters';

export default function CourseCard({ course }) {
  const { id, title, category, level, icon, gradient, durationWeeks, lessons, price, rating, students, instructor, summary } =
    course;

  return (
    <article className="listing-card">
      <div className="listing-card__media" style={{ background: gradient }}>
        <span aria-hidden>{icon}</span>
        <div className="listing-card__badges">
          <span className="badge badge--dark">{category}</span>
          <span className="badge badge--primary">{level}</span>
        </div>
      </div>

      <div className="listing-card__body">
        <div>
          <h3 className="listing-card__title">{title}</h3>
          <p className="listing-card__meta">
            <span>👨‍🏫 {instructor}</span>
            <span>⭐ {rating.toFixed(1)}</span>
          </p>
        </div>

        <p className="listing-card__desc">{summary}</p>

        <p className="listing-card__meta">
          <span>📅 {formatDuration(durationWeeks)}</span>
          <span>🎞️ {lessons} lessons</span>
          <span>👥 {students.toLocaleString()} students</span>
        </p>

        <div className="listing-card__footer">
          <span className="listing-card__price">
            {formatCurrency(price)} <small>one-time</small>
          </span>
          <Link className="btn btn--outline btn--sm" to={`/courses/${id}`}>
            View Course
          </Link>
        </div>
      </div>
    </article>
  );
}
