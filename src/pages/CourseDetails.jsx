import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, formatDuration } from '../utils/formatters';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setCourse(null);
    courseService.getById(id).then(setCourse).catch((e) => setError(e.message));
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    setEnrolling(true);
    try {
      await courseService.enroll(id);
      navigate('/portal/courses');
    } catch (err) {
      setNotice(err.message);
      setEnrolling(false);
    }
  };

  if (error) {
    return (
      <div className="section container">
        <div className="alert alert--error">⚠️ {error}</div>
        <Link to="/courses" className="btn btn--outline">← Back to courses</Link>
      </div>
    );
  }

  if (!course) return <LoadingSpinner label="Loading course…" />;

  const {
    title, category, level, icon, gradient, durationWeeks, lessons, price,
    rating, students, instructor, summary, description, outcomes, syllabus, tags,
  } = course;

  return (
    <>
      <div className="page-hero" style={{ textAlign: 'left' }}>
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / <span>{title}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <span
              style={{
                width: 72, height: 72, borderRadius: 'var(--border-radius-lg)',
                background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', flexShrink: 0,
              }}
              aria-hidden
            >
              {icon}
            </span>
            <div>
              <h1 className="page-hero__title" style={{ marginBottom: 'var(--space-1)' }}>{title}</h1>
              <p className="page-hero__subtitle" style={{ margin: 0 }}>
                {category} · {level} · {formatDuration(durationWeeks)} · taught by {instructor}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div>
              <div className="prose">
                <p><strong>{summary}</strong></p>
                <p>{description}</p>

                <h3>What you'll be able to do</h3>
                <ul>
                  {outcomes.map((item) => <li key={item}>{item}</li>)}
                </ul>

                <h3>Course syllabus</h3>
              </div>

              <div className="status-timeline" style={{ marginTop: 'var(--space-4)' }}>
                {syllabus.map((module, i) => (
                  <div key={module.title} className="status-step status-step--done">
                    <span className="status-step__dot">{i + 1}</span>
                    <div>
                      <div className="status-step__title">{module.title}</div>
                      <div className="status-step__meta">{module.weeks}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ margin: 'var(--space-8) 0 var(--space-4)' }}>Tools & topics covered</h3>
              <div className="listing-card__tags">
                {tags.map((tag) => (
                  <span key={tag} className="badge badge--primary">{tag}</span>
                ))}
              </div>
            </div>

            <aside className="details-sidebar">
              <div className="panel">
                <div className="panel__body">
                  {notice && <div className="alert alert--info">{notice}</div>}

                  <div className="listing-card__price" style={{ fontSize: 'var(--font-size-3xl)' }}>
                    {formatCurrency(price)}
                  </div>
                  <p className="form-hint" style={{ marginBottom: 'var(--space-5)' }}>
                    One-time payment · lifetime access
                  </p>

                  <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    {[
                      ['🎞️', `${lessons} lessons`],
                      ['📅', `${formatDuration(durationWeeks)} at your pace`],
                      ['⭐', `${rating.toFixed(1)} average rating`],
                      ['👥', `${students.toLocaleString()} enrolled`],
                      ['🏅', 'Certificate included'],
                    ].map(([emoji, text]) => (
                      <div key={text} style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                        <span aria-hidden>{emoji}</span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="primary" size="lg" block onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Enrolling…' : 'Enroll Now'}
                  </Button>
                  <Button
                    as={Link}
                    to={isAuthenticated ? '/portal/courses' : '/login'}
                    variant="ghost"
                    block
                    style={{ marginTop: 'var(--space-3)' }}
                  >
                    {isAuthenticated ? 'View My Courses' : 'Sign in to track progress'}
                  </Button>

                  <p className="form-hint" style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                    7-day money-back guarantee
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
