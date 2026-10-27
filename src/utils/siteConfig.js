/**
 * Single source of truth for official NextGen Learners contact + social details.
 * Update these values here and they propagate across Navbar, Footer and Contact.
 */
export const siteConfig = {
  name: 'NextGen Learners',
  tagline: 'Code • Learn • Innovate • Succeed',
  website: 'https://nextgenlearners.com',
  email: 'nextgenlearners.official@gmail.com',
  whatsapp: {
    chat: 'https://wa.me/923368539248',
    channel: 'https://whatsapp.com/channel/0029Vb8B6kFHgZWb7AKQIn3a',
  },
  social: [
    { key: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/nextgenlearners_official/' },
    { key: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61568976387750' },
    { key: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/nextgenlearners-official/' },
    { key: 'whatsapp', name: 'WhatsApp Channel', url: 'https://whatsapp.com/channel/0029Vb8B6kFHgZWb7AKQIn3a' },
  ],
};

export const mailto = `mailto:${siteConfig.email}`;
