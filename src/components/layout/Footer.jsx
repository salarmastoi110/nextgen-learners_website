import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon, WhatsappIcon } from '../common/BrandIcons';
import { footerNavigation } from '../../data/navigation';
import { siteConfig, mailto } from '../../utils/siteConfig';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/logo-white.svg" alt={APP_NAME} />
            <p className="footer__desc">
              {APP_NAME} bridges the gap between education and employment with verified
              internships, industry-designed courses, live sessions, real projects and
              certificates employers trust.
            </p>
            <div className="footer__socials">
              {siteConfig.social.map((social) => {
                const Icon = socialIcons[social.key] || Mail;
                return (
                  <a
                    key={social.key}
                    className="footer__social"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    title={social.name}
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="footer__title">Platform</h4>
            <div className="footer__links">
              {footerNavigation.platform.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer__title">Account</h4>
            <div className="footer__links">
              {footerNavigation.account.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer__title">Company</h4>
            <div className="footer__links">
              {footerNavigation.company.map((link) => (
                <Link key={link.label} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <div className="footer__contact-item">
                <Mail size={16} />
                <a href={mailto}>{siteConfig.email}</a>
              </div>
              <div className="footer__contact-item">
                <WhatsappIcon size={16} />
                <a href={siteConfig.whatsapp.chat} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </div>
              <div className="footer__contact-item">
                <Phone size={16} />
                <a href={siteConfig.website} target="_blank" rel="noreferrer">
                  {siteConfig.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {APP_NAME} · {APP_TAGLINE}
          </span>
          <div className="footer__bottom-links">
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
