import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { navigation, primaryNavPaths, moreNavigation } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/formatters';
import Button from '../common/Button';

const extraStyles = `
.navbar__user-name { display: inline; }
@media (max-width: 768px) { .navbar__user-name { display: none; } }
`;

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const portalPath =
    user.role === 'admin' ? '/admin' : user.role === 'ambassador' ? '/ambassador/dashboard' : '/portal/dashboard';
  const portalLabel =
    user.role === 'admin' ? 'Admin Panel' : user.role === 'ambassador' ? 'Ambassador Portal' : 'My Portal';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar__user" ref={ref}>
      <button className="navbar__user-btn" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{initials(user.name)}</span>
        <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div className="dropdown">
          <Link className="dropdown__item" to={portalPath} onClick={() => setOpen(false)}>
            📦 {portalLabel}
          </Link>
          <Link className="dropdown__item" to="/portal/profile" onClick={() => setOpen(false)}>
            👤 Profile
          </Link>
          <div className="dropdown__divider" />
          <button className="dropdown__item dropdown__item--danger" onClick={handleLogout}>
            ↩ Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function MoreMenu({ moreActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="navbar__more" ref={ref}>
      <button
        className={`navbar__link navbar__more-btn ${moreActive ? 'navbar__link--active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        More
        <span className={`navbar__more-caret ${open ? 'navbar__more-caret--open' : ''}`} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="dropdown dropdown--more">
          {moreNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `dropdown__item ${isActive ? 'dropdown__item--active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const primaryLinks = navigation.filter((item) => primaryNavPaths.includes(item.path));
  const moreActive = moreNavigation.some((item) => location.pathname.startsWith(item.path));

  useEffect(() => {
    // Close mobile menu on outside click
    const close = () => setMobileOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header className="navbar">
      <style>{extraStyles}</style>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="NextGen Learners home">
          <img src="/logo.svg" alt="NextGen Learners" />
        </Link>

        <nav className={`navbar__menu ${mobileOpen ? 'navbar__menu--open' : ''}`}>
          {primaryLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Desktop-only "More" dropdown */}
          <MoreMenu moreActive={moreActive} />

          {/* Secondary links rendered flat inside the mobile panel */}
          {moreNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar__link navbar__link--more-item ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" as={Link} to="/login">
                Sign In
              </Button>
              <Button variant="primary" size="sm" as={Link} to="/register">
                Get Started
              </Button>
            </>
          )}

          <button
            className={`navbar__toggle ${mobileOpen ? 'navbar__toggle--open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
