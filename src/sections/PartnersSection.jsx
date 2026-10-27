import SectionHeading from '../components/common/SectionHeading';
import { partners } from '../data/dashboard';

export default function PartnersSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Our Network"
          title="180+ companies hire from NGL"
          subtitle="Our internship partners post roles directly on the platform and interview graduating cohorts first."
        />
        <div className="partners-track">
          {partners.map((partner) => (
            <div key={partner.name} className="partner-chip">
              <span className="partner-chip__mark" aria-hidden>
                {partner.mark}
              </span>
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
