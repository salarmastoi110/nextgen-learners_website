export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  children,
}) {
  return (
    <div
      className={`section-heading ${align === 'left' ? 'section-heading--left' : ''}`}
    >
      {eyebrow && <span className="section-heading__eyebrow">{eyebrow}</span>}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
