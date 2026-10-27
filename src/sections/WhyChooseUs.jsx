import SectionHeading from '../components/common/SectionHeading';
import { whyChooseUs } from '../data/dashboard';

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Why NextGen Learners"
          title="Built around outcomes, not content"
          subtitle="Platforms give you lectures. We give you experience, evidence and access."
        />
        <div className="programs-grid">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="feature-list" style={{ gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
              <span
                className="feature-list__icon"
                style={{ width: 56, height: 56, fontSize: '1.5rem' }}
                aria-hidden
              >
                {item.icon}
              </span>
              <div className="feature-list__title" style={{ fontSize: 'var(--font-size-md)' }}>
                {item.title}
              </div>
              <div className="feature-list__desc">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
