export default function StatCard({ icon, label, value, trend, color = 'var(--teal-100)', iconColor = 'var(--teal-700)' }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: color, color: iconColor }} aria-hidden>
        {icon}
      </div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">
          {label}
          {trend && (
            <span
              style={{
                marginLeft: '0.5rem',
                color: trend.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 700,
                fontSize: 'var(--font-size-xs)',
              }}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
