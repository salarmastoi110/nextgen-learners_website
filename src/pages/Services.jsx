import SectionHeading from '../components/common/SectionHeading';
import ServiceCard from '../components/cards/ServiceCard';
import { services } from '../data/services';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Our Services</h1>
          <p className="page-hero__subtitle">
            Six connected services that take you from first lesson to first job offer —
            whether you're a student, a working professional or an employer.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="programs-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <SectionHeading
              eyebrow="How it works"
              title="A simple path to career readiness"
            />
            <div className="status-timeline" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'left' }}>
              {[
                ['Create your free profile', 'Sign up, tell us your goals and current skill level.'],
                ['Learn with a course', 'Pick a track, build projects, get mentored weekly.'],
                ['Apply to internships', 'One-click apply to verified roles from partner companies.'],
                ['Get certified & hired', 'Earn verifiable certificates — employers check them in seconds.'],
              ].map(([title, meta], i) => (
                <div key={title} className="status-step status-step--done">
                  <span className="status-step__dot">{i + 1}</span>
                  <div>
                    <div className="status-step__title">{title}</div>
                    <div className="status-step__meta">{meta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero__actions" style={{ justifyContent: 'center', marginTop: 'var(--space-10)' }}>
              <Link to="/register" className="btn btn--primary btn--lg">Start for Free</Link>
              <Link to="/contact" className="btn btn--outline btn--lg">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
