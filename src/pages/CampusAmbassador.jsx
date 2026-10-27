import { Link } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import { ambassadorProgram } from '../data/campusAmbassador';
import { useAuth } from '../context/AuthContext';

export default function CampusAmbassador() {
  const { isAuthenticated, user } = useAuth();
  const { overview, responsibilities, eligibility, benefits, applicationSteps, faqs } =
    ambassadorProgram;

  const applyPath = isAuthenticated ? '/ambassador' : '/register';
  const applyLabel = isAuthenticated ? 'Open Ambassador Portal' : 'Apply Now';

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="badge badge--primary" style={{ marginBottom: 'var(--space-4)' }}>
            🎒 Campus Ambassador Program
          </span>
          <h1 className="page-hero__title">Lead Your Campus Tech Community</h1>
          <p className="page-hero__subtitle">{overview}</p>
          <div className="hero__actions">
            <Link to={applyPath} className="btn btn--primary btn--lg">{applyLabel}</Link>
            <a href="#faq" className="btn btn--outline btn--lg">Read the FAQs</a>
          </div>
        </div>
      </div>

      {/* ---------- Responsibilities & Eligibility ---------- */}
      <section className="section">
        <div className="container">
          <div className="details-grid">
            <div className="card">
              <h2 className="card__title" style={{ marginBottom: 'var(--space-6)' }}>
                📋 What Ambassadors Do
              </h2>
              <ul className="check-list">
                {responsibilities.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="card">
              <h2 className="card__title" style={{ marginBottom: 'var(--space-6)' }}>
                ✅ Who Can Apply
              </h2>
              <ul className="check-list">
                {eligibility.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Why become an ambassador"
            title="Benefits Built on Real Contribution"
            subtitle="Every benefit below is earned through approved, verified work — never just signed up for."
          />
          <div className="programs-grid">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="card card--hover"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
                  padding: 'var(--space-6)',
                }}
              >
                <span className="feature-list__icon" aria-hidden>{benefit.icon}</span>
                <div>
                  <div className="feature-list__title">{benefit.title}</div>
                  <div className="feature-list__desc">{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Application process ---------- */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="Application Process" />
          <div className="status-timeline" style={{ maxWidth: 720, margin: '0 auto' }}>
            {applicationSteps.map((step, i) => (
              <div key={step} className="status-step status-step--done">
                <span className="status-step__dot">{i + 1}</span>
                <div>
                  <div className="status-step__title">{step}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section section--alt" id="faq">
        <div className="container" style={{ maxWidth: 780 }}>
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary className="faq-item__q">{faq.q}</summary>
                <p className="faq-item__a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <h2 className="cta-section__title">Ready to represent NextGen Learners on campus?</h2>
            <p className="cta-section__text">
              {isAuthenticated && user?.role === 'student'
                ? 'Head to your ambassador portal to view tasks, points and resources.'
                : 'Create your free account and start your Campus Ambassador application today.'}
            </p>
            <div className="hero__actions" style={{ justifyContent: 'center', marginBottom: 0, position: 'relative', zIndex: 1 }}>
              <Link to={applyPath} className="btn btn--light btn--lg">{applyLabel}</Link>
              <Link to="/contact" className="btn btn--outline-light btn--lg">Ask Us Something</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
