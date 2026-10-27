import { Link } from 'react-router-dom';
import { ambassadorProgram } from '../data/campusAmbassador';

/** Campus Ambassador introduction strip for the home page. */
export default function AmbassadorPreview() {
  const highlights = ambassadorProgram.benefits.slice(0, 4);

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="content-grid content-grid--2" style={{ alignItems: 'center', gap: 'var(--space-16)' }}>
          <div>
            <span className="badge badge--primary" style={{ marginBottom: 'var(--space-5)' }}>
              🎒 Campus Ambassador Program
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)' }}>
              Lead tech on <span className="text-gradient">your campus</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', lineHeight: 1.75 }}>
              Represent NextGen Learners, bring real opportunities to your fellow students and
              earn verified experience, points and certificates for genuine contribution.
            </p>
            <div className="hero__actions" style={{ marginTop: 'var(--space-8)' }}>
              <Link to="/campus-ambassador" className="btn btn--primary btn--lg">
                Learn More &amp; Apply
              </Link>
              <Link to="/sessions" className="btn btn--outline btn--lg">
                See Upcoming Events
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {highlights.map((benefit) => (
              <div
                key={benefit.title}
                className="card card--hover"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
                  padding: 'var(--space-5) var(--space-6)',
                }}
              >
                <span className="feature-list__icon" aria-hidden>{benefit.icon}</span>
                <div>
                  <div className="feature-list__title" style={{ fontSize: 'var(--font-size-base)' }}>{benefit.title}</div>
                  <div className="feature-list__desc">{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
