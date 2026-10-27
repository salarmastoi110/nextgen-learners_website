import SectionHeading from '../components/common/SectionHeading';
import TestimonialCard from '../components/cards/TestimonialCard';
import { testimonials } from '../data/testimonials';

export default function TestimonialsSection() {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHeading
          eyebrow="Success Stories"
          title="Learners who made the leap"
          subtitle="From first application to first offer — real words from real NGL students and interns."
        />
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
