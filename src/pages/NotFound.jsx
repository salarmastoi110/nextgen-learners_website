import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-page__code">404</div>
      <h1 style={{ marginBottom: 'var(--space-4)' }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 460, marginBottom: 'var(--space-8)' }}>
        The page you're looking for was moved, deleted — or never existed. Let's get you back
        on track.
      </p>
      <div className="hero__actions" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn--primary btn--lg">Go Home</Link>
        <Link to="/internships" className="btn btn--outline btn--lg">Browse Internships</Link>
      </div>
    </div>
  );
}
