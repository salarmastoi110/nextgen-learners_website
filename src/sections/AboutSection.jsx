import { Link } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';
import HexMark from '../components/common/HexMark';
import { aboutHighlights } from '../data/dashboard';

export default function AboutSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="about-split">
          <div className="about-split__visual">
            <HexMark className="about-split__hex" size={190} mint="rgba(255,255,255,0.95)" contrast="#ffffff" />
            <blockquote>
              “The gap between a degree and a job isn't talent — it's opportunity,
              mentorship and proof of work. We built NextGen Learners to close all three.”
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="avatar" aria-hidden>
                NR
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>Naveed Rahman</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--teal-200)' }}>
                  Founder, NextGen Learners
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title="Education that ends in employment"
              subtitle="NextGen Learners is a career-launch platform for students who are tired of theory without application. We combine internships, courses, mentorship and verifiable certification into one journey."
            />
            <div className="feature-list">
              {aboutHighlights.map((item) => (
                <div key={item.title} className="feature-list__item">
                  <span className="feature-list__icon" aria-hidden>
                    {item.icon}
                  </span>
                  <div>
                    <div className="feature-list__title">{item.title}</div>
                    <div className="feature-list__desc">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-8)' }}>
              <Link to="/about" className="btn btn--secondary">
                Our Story & Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
