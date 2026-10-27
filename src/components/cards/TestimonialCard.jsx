export default function TestimonialCard({ testimonial }) {
  const { name, role, quote, rating, initials } = testimonial;

  return (
    <figure className="testimonial-card">
      <div className="testimonial-card__stars" aria-label={`${rating} out of 5 stars`}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </div>
      <blockquote className="testimonial-card__quote">“{quote}”</blockquote>
      <figcaption className="testimonial-card__author">
        <span className="avatar" aria-hidden>
          {initials}
        </span>
        <span>
          <div className="testimonial-card__name">{name}</div>
          <div className="testimonial-card__role">{role}</div>
        </span>
      </figcaption>
    </figure>
  );
}
