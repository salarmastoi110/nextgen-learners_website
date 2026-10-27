import { Link } from 'react-router-dom';
import SectionHeading from '../components/common/SectionHeading';

const programs = [
  {
    icon: '💼',
    title: 'Internships',
    description: 'Verified roles with partner companies — remote, hybrid and on-site, with stipends and real responsibilities.',
    path: '/internships',
    cta: 'Browse internships',
    bg: 'var(--teal-100)',
    fg: 'var(--teal-700)',
  },
  {
    icon: '📚',
    title: 'Courses',
    description: 'Project-driven training in development, data, design, cloud, security and marketing — taught by practitioners.',
    path: '/courses',
    cta: 'Explore courses',
    bg: 'var(--indigo-100)',
    fg: 'var(--indigo-700)',
  },
  {
    icon: '🛠️',
    title: 'Student Projects',
    description: 'See what our learners ship: live web apps, mobile apps and AI tools built in cohort teams.',
    path: '/projects',
    cta: 'View projects',
    bg: '#fef3c7',
    fg: '#92400e',
  },
  {
    icon: '🏅',
    title: 'Certification',
    description: 'Every completion earns a certificate with a public verification code anyone can check.',
    path: '/verify-certificate',
    cta: 'Verify a certificate',
    bg: '#dcfce7',
    fg: '#166534',
  },
];

export default function ProgramsSection() {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHeading
          eyebrow="What we offer"
          title="Four programs, one career launch"
          subtitle="Start wherever you are — each path connects to the next, and everything you earn is verifiable."
        />
        <div className="programs-grid">
          {programs.map((program) => (
            <Link key={program.title} to={program.path} className="program-card">
              <div
                className="program-card__icon"
                style={{ background: program.bg, color: program.fg }}
                aria-hidden
              >
                {program.icon}
              </div>
              <h3 className="program-card__title">{program.title}</h3>
              <p className="program-card__desc">{program.description}</p>
              <span className="program-card__link">{program.cta} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
