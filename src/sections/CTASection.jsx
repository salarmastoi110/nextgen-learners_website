import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HexMark from '../components/common/HexMark';
import { APP_TAGLINE } from '../utils/constants';

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="section">
      <div className="container">
        <div className="cta-section">
          <HexMark className="cta-section__hex" size={230} mint="rgba(255,255,255,0.95)" contrast="#ffffff" />
          <p className="cta-section__tagline">{APP_TAGLINE}</p>
          <h2 className="cta-section__title">Your career starts with one application</h2>
          <p className="cta-section__text">
            Join thousands of students turning ambition into experience. Browse open
            internships, enrol in a course, and earn certificates employers trust.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center', marginBottom: 0, position: 'relative', zIndex: 1 }}>
            <Link to={isAuthenticated ? '/portal/internships' : '/register'} className="btn btn--light btn--lg">
              {isAuthenticated ? 'Browse Internships' : 'Create Free Account'}
            </Link>
            <Link to="/contact" className="btn btn--outline-light btn--lg">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
