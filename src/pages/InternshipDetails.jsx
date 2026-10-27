import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { internshipService } from '../services/internshipService';
import { formatCurrency, formatDate, formatDuration } from '../utils/formatters';

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setInternship(null);
    internshipService
      .getById(id)
      .then(setInternship)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="section container">
        <div className="alert alert--error">⚠️ {error}</div>
        <Link to="/internships" className="btn btn--outline">← Back to internships</Link>
      </div>
    );
  }

  if (!internship) return <LoadingSpinner label="Loading internship…" />;

  const {
    title, company, type, level, location, durationWeeks, stipend, openings,
    deadline, status, icon, gradient, skills, summary, responsibilities, requirements,
    benefits, perks,
  } = internship;

  return (
    <>
      <div className="page-hero" style={{ textAlign: 'left' }}>
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/internships">Internships</Link> / <span>{title}</span>
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
              <p className="page-hero__subtitle" style={{ margin: 0 }}>{company} · {location}</p>
            </div>
            <span className={`badge ${status === 'Open' ? 'badge--success' : status === 'Closing Soon' ? 'badge--warning' : 'badge--danger'}`} style={{ marginLeft: 'auto' }}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)' }}>
                About this role
              </h2>
              <div className="prose">
                <p>{summary}</p>

                <h3>What you'll do</h3>
                <ul>
                  {responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>

                <h3>Requirements</h3>
                <ul>
                  {requirements.map((item) => <li key={item}>{item}</li>)}
                </ul>

                <h3>What you'll get</h3>
                <ul>
                  {benefits.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>

              <h3 style={{ marginTop: 'var(--space-10)', marginBottom: 'var(--space-4)' }}>Skills you'll use</h3>
              <div className="listing-card__tags">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge--primary">{skill}</span>
                ))}
              </div>
            </div>

            <aside className="details-sidebar">
              <div className="panel">
                <div className="panel__body">
                  <h3 style={{ marginBottom: 'var(--space-5)' }}>Role Summary</h3>
                  {[
                    ['Work type', type],
                    ['Level', level],
                    ['Duration', formatDuration(durationWeeks)],
                    ['Stipend', `${formatCurrency(stipend)} / month`],
                    ['Openings', `${openings} positions`],
                    ['Apply before', formatDate(deadline)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)',
                        padding: 'var(--space-3) 0', borderBottom: '1px solid var(--gray-100)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
                    <Button as={Link} to={`/apply/${id}`} variant="primary" size="lg" block>
                      Apply Now
                    </Button>
                    <Button as={Link} to="/internships" variant="ghost" block>
                      ← Back to all internships
                    </Button>
                  </div>

                  <div className="listing-card__tags" style={{ marginTop: 'var(--space-5)' }}>
                    {perks.map((perk) => (
                      <span key={perk} className="badge">{perk}</span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
