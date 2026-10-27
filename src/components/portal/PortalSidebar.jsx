import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

export default function PortalSidebar({ links, brandLabel, open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <aside className={`portal-sidebar ${open ? 'portal-sidebar--open' : ''}`}>
        <Link to="/" className="portal-sidebar__brand" onClick={onClose}>
          <img src="/logo-white.svg" alt={`${APP_NAME} logo`} />
        </Link>

        {brandLabel && (
          <div className="portal-sidebar__section-title" style={{ marginTop: 0 }}>
            {brandLabel}
          </div>
        )}

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `portal-sidebar__link ${isActive ? 'portal-sidebar__link--active' : ''}`
              }
              onClick={onClose}
            >
              <span aria-hidden>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="portal-sidebar__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0 var(--space-3) var(--space-4)' }}>
            <span className="avatar" aria-hidden>
              {user?.name?.slice(0, 1).toUpperCase()}
            </span>
            <span style={{ minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>
                {user?.email}
              </div>
            </span>
          </div>
          <button className="portal-sidebar__link" onClick={handleLogout} style={{ width: '100%' }}>
            <span aria-hidden>↩</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {open && <div className="portal-sidebar__overlay" onClick={onClose} aria-hidden />}
    </>
  );
}
