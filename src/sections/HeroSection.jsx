import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HexMark from '../components/common/HexMark';
import { heroStats } from '../data/dashboard';
import { APP_TAGLINE } from '../utils/constants';

const floatCards = [
  { icon: '💻', title: 'Web Development Intern', meta: 'Remote · 12 weeks · PKR 35,000/mo', bg: 'var(--teal-100)', fg: 'var(--teal-700)' },
  { icon: '📊', title: 'Data Science Intern', meta: 'Hybrid · Karachi · 16 weeks', bg: 'var(--indigo-100)', fg: 'var(--indigo-700)' },
  { icon: '🏅', title: 'Certificate NGL-PY-2026-0417', meta: '✓ Verified online', bg: '#dcfce7', fg: '#166534' },
];

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <div>
            <span className="hero__eyebrow">
              <span className="hero__eyebrow-dot" aria-hidden />
              Admissions open for Fall 2026 cohorts
            </span>
            <h1 className="hero__title">
              Build real skills. <br />
              <span className="text-gradient">Land real opportunities.</span>
            </h1>
            <p className="hero__tagline" aria-label={APP_TAGLINE}>{APP_TAGLINE}</p>
            <p className="hero__subtitle">
              NextGen Learners connects ambitious students with verified internships,
              industry-designed courses and real-world projects — ending in certificates
              employers can verify in seconds.
            </p>
            <div className="hero__actions">
              <Link to="/internships" className="btn btn--primary btn--lg">
                Find an Internship
                <ArrowRight size={18} />
              </Link>
              <Link to="/courses" className="btn btn--outline btn--lg">
                Explore Courses
              </Link>
            </div>
            <div className="hero__trust">
              {heroStats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong> {stat.label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero__visual" aria-hidden>
            <HexMark className="hero__hex-mark" size={210} />
            <div className="hero__card-stack">
              {floatCards.map((card) => (
                <div key={card.title} className="hero__float-card">
                  <span
                    className="hero__float-icon"
                    style={{ background: card.bg, color: card.fg }}
                  >
                    {card.icon}
                  </span>
                  <span>
                    <div style={{ fontWeight: 700 }}>{card.title}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {card.meta}
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
