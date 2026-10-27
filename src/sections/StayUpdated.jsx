import SectionHeading from '../components/common/SectionHeading';
import { siteConfig } from '../utils/siteConfig';
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from '../components/common/BrandIcons';

/** What students get by following the official channels. */
const feedTopics = [
  { icon: '🎓', label: 'Internships & Training Programs' },
  { icon: '🤖', label: 'AI & Technology Workshops' },
  { icon: '📊', label: 'Data Science & Machine Learning Courses' },
  { icon: '💻', label: 'Web Development Programs' },
  { icon: '📢', label: 'Events & Important Announcements' },
  { icon: '🎯', label: 'Career & Learning Opportunities' },
];

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
};

/** "Stay updated" — official social channels strip for the home page. */
export default function StayUpdated() {
  return (
    <section className="section" id="stay-updated">
      <div className="container">
        <SectionHeading
          eyebrow="Community"
          title="Stay updated with NextGen Learners"
          subtitle="Follow our official social media platforms and check them regularly for updates, opportunities and learning content."
        />

        <div className="stay-grid">
          {feedTopics.map((topic) => (
            <div key={topic.label} className="stay-chip card card--hover">
              <span className="stay-chip__icon" aria-hidden>
                {topic.icon}
              </span>
              <span className="stay-chip__label">{topic.label}</span>
            </div>
          ))}
        </div>

        <div className="social-tiles">
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
                    <Icon size={22} />
                  </span>
                )}
                <span>
                  <span className="social-tile__name">{channel.name}</span>
                  <span className="social-tile__cta">Follow us →</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
