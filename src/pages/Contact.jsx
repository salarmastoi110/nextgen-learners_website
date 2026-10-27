import SectionHeading from '../components/common/SectionHeading';
import ContactForm from '../components/forms/ContactForm';
import { siteConfig, mailto } from '../utils/siteConfig';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from '../components/common/BrandIcons';

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
};

const infoCards = [
  { icon: '✉️', title: 'Email Us', lines: [siteConfig.email], href: mailto },
  {
    icon: '💬',
    title: 'WhatsApp',
    lines: ['+92 336 8539248', 'Mon–Sat, 10am–7pm PKT'],
    href: siteConfig.whatsapp.chat,
  },
  {
    icon: '📣',
    title: 'Stay Updated',
    lines: ['Follow our official channels for internships, workshops, events and career opportunities.'],
  },
];

const faqs = [
  ['Is there a fee to verify a certificate?', 'No — verification is always free for employers, recruiters or anyone with the certificate code.'],
  ['How fast do you reply to messages?', 'Within one business day. Partnership enquiries are handled by our network team directly.'],
  ['Can I apply to multiple internships at once?', 'Yes — you can apply to as many open roles as you like from your student portal.'],
];

export default function Contact() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero__title">Contact Us</h1>
          <p className="page-hero__subtitle">
            Questions about a program, an application or partnering with us? We read every
            message.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <SectionHeading align="left" eyebrow="Get in touch" title="We're here to help" />
              {infoCards.map((card) => (
                <div key={card.title} className="contact-info-card">
                  <span className="feature-list__icon" aria-hidden>
                    {card.icon}
                  </span>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: '0.25rem' }}>
                      {card.title}
                    </h4>
                    {card.lines.map((line) => (
                      <p key={line} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        {card.href ? (
                          <a href={card.href} target="_blank" rel="noopener noreferrer">{line}</a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="social-tiles" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 'var(--space-6)' }}>
                {siteConfig.social.map((channel) => {
                  const Icon = socialIcons[channel.key];
                  return (
                    <a
                      key={channel.key}
                      className="social-tile"
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {Icon && (
                        <span className="social-tile__icon" aria-hidden>
                          <Icon size={20} />
                        </span>
                      )}
                      <span>
                        <span className="social-tile__name">{channel.name}</span>
                        <span className="social-tile__cta">Follow →</span>
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="panel" style={{ marginTop: 'var(--space-6)' }}>
                <div className="panel__body">
                  <h3 style={{ marginBottom: 'var(--space-5)' }}>Quick answers</h3>
                  <div className="status-timeline">
                    {faqs.map(([q, a]) => (
                      <div key={q} className="status-step status-step--done">
                        <span className="status-step__dot">?</span>
                        <div>
                          <div className="status-step__title">{q}</div>
                          <div className="status-step__meta" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {a}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Send us a message</h3>
              </div>
              <div className="panel__body">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
