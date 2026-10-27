import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../sections/CTASection';
import { statistics } from '../data/dashboard';

const values = [
  { icon: '🎯', title: 'Outcome-obsessed', description: 'We measure success in offers accepted, not hours watched.' },
  { icon: '🔍', title: 'Radical transparency', description: 'Stipends, expectations and certificates — everything is verifiable.' },
  { icon: '🤝', title: 'Community first', description: 'Cohorts, mentors and alumni who genuinely help each other grow.' },
  { icon: '🌱', title: 'Always learning', description: 'Curriculum refreshes every quarter to match what industry needs now.' },
];

const team = [
  { name: 'Naveed Rahman', role: 'Founder & CEO', initials: 'NR', bg: 'var(--gradient-brand)' },
  { name: 'Sana Mir', role: 'Head of Curriculum', initials: 'SM', bg: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
  { name: 'Hamza Raza', role: 'Lead Engineering Mentor', initials: 'HR', bg: 'linear-gradient(135deg, #0284c7, #22d3ee)' },
  { name: 'Zara Sheikh', role: 'Design & Projects Lead', initials: 'ZS', bg: 'linear-gradient(135deg, #db2777, #f472b6)' },
];

const timeline = [
  ['2023', 'Founded in Karachi with 22 students and one React bootcamp.'],
  ['2024', 'First 10-company internship partner network; courses cross 1,000 enrolments.'],
  ['2025', 'Launched public certificate verification and the student project studio.'],
  ['2026', '3,200+ learners, 180+ hiring partners, tracks across dev, data, design, cloud and marketing.'],
];

export default function About() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">About NextGen Learners</h1>
          <p className="page-hero__subtitle">
            We exist to make the jump from education to employment honest, structured and
            provable — for every student, everywhere.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-split">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="Born from a simple frustration"
              />
              <div className="prose" style={{ marginTop: '0' }}>
                <p>
                  Every year, thousands of graduates in Pakistan and beyond discover that a
                  degree alone doesn't prove anything to an employer. No projects, no
                  production experience, no way to verify what they actually learned.
                </p>
                <p>
                  NextGen Learners was founded in 2023 to fix that. We built a platform where
                  students train on real problems, intern at vetted companies, ship portfolio
                  projects, and finish with certificates that carry a public verification
                  code — trust you can link directly on your CV.
                </p>
                <p>
                  Today we run cohorts across six career tracks, and our partner network of
                  180+ companies hires directly from the platform.
                </p>
              </div>
            </div>

            <div className="stats-band" style={{ padding: 'var(--space-10)' }}>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {statistics.map((stat) => (
                  <div key={stat.label}>
                    <div className="stats-grid__value">
                      {stat.value.toLocaleString()}
                      <span>{stat.suffix}</span>
                    </div>
                    <div className="stats-grid__label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="What we believe" title="Four values we refuse to compromise" />
          <div className="programs-grid">
            {values.map((value) => (
              <div key={value.title} className="program-card" style={{ cursor: 'default' }}>
                <div className="program-card__icon" style={{ background: 'var(--teal-100)' }} aria-hidden>
                  {value.icon}
                </div>
                <h3 className="program-card__title">{value.title}</h3>
                <p className="program-card__desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="details-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <SectionHeading align="left" eyebrow="Milestones" title="How we got here" />
              <div className="status-timeline">
                {timeline.map(([year, text]) => (
                  <div key={year} className="status-step status-step--done">
                    <span className="status-step__dot">✓</span>
                    <div>
                      <div className="status-step__title">{year}</div>
                      <div className="status-step__meta" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading align="left" eyebrow="The Team" title="Practitioners, not lecturers" />
              <div className="content-grid content-grid--2">
                {team.map((member) => (
                  <div key={member.name} className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                    <span
                      className="avatar avatar--lg"
                      style={{ background: member.bg, margin: '0 auto var(--space-4)' }}
                      aria-hidden
                    >
                      {member.initials}
                    </span>
                    <h4 style={{ fontSize: 'var(--font-size-base)' }}>{member.name}</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
