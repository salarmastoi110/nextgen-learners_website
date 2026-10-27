import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/formatters';

export default function PortalHeader({ title, actions, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="portal-header">
      <div className="portal-header__left">
        <button className="portal-header__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>
        <h1 className="portal-header__title">{title}</h1>
      </div>

      <div className="portal-header__actions">
        {actions}
        <button className="portal-header__icon-btn" aria-label="Notifications">
          🔔
          <span className="portal-header__badge-dot" />
        </button>
        <Link to="/portal/profile" className="navbar__user-btn" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0.4rem 0.7rem 0.4rem 0.4rem', borderRadius: 'var(--border-radius-full)', border: '1.5px solid var(--border-color)', background: '#fff', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
          <span className="avatar">{initials(user?.name)}</span>
          <span className="portal-header__username">{user?.name?.split(' ')[0]}</span>
        </Link>
      </div>

      <style>{`
        @media (max-width: 600px) { .portal-header__username { display: none; } }
      `}</style>
    </header>
  );
}
