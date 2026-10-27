export default function ServiceCard({ service }) {
  const { title, icon, gradient, description, features } = service;

  return (
    <article className="program-card">
      <div className="program-card__icon" style={{ background: gradient, color: '#fff' }}>
        <span aria-hidden>{icon}</span>
      </div>
      <h3 className="program-card__title">{title}</h3>
      <p className="program-card__desc">{description}</p>
      <ul style={{ display: 'grid', gap: '0.4rem' }}>
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)',
              paddingLeft: '1.2rem',
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', left: 0, color: 'var(--color-primary)' }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
