export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message,
  children,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden>
        {icon}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p>{message}</p>}
      {children && <div style={{ marginTop: 'var(--space-6)' }}>{children}</div>}
    </div>
  );
}
