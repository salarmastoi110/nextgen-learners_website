import { formatDate } from '../../utils/formatters';

export default function ProfileCard({ user, stats = [] }) {
  return (
    <div className="panel">
      <div className="panel__body" style={{ textAlign: 'center' }}>
        <div className="profile-card__avatar" aria-hidden>
          {user?.name?.slice(0, 1).toUpperCase()}
        </div>
        <h3 style={{ marginBottom: '0.25rem' }}>{user?.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {user?.email}
        </p>
        <span
          className={`badge ${user?.role === 'admin' ? 'badge--warning' : 'badge--primary'}`}
          style={{ marginTop: 'var(--space-3)', textTransform: 'capitalize' }}
        >
          {user?.role}
        </span>

        {user?.joinedAt && (
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
            Member since {formatDate(user.joinedAt)}
          </p>
        )}

        {stats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
              gap: 'var(--space-3)',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="stat-card__value" style={{ fontSize: 'var(--font-size-xl)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
