import { siteConfig } from '../utils/siteConfig';

export const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Internships', path: '/internships' },
  { label: 'Courses', path: '/courses' },
  { label: 'Sessions & Webinars', path: '/sessions' },
  { label: 'Campus Ambassador', path: '/campus-ambassador' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/services' },
  { label: 'Verify Certificate', path: '/verify-certificate' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

/* Links shown directly in the desktop navbar; the rest live under "More" */
export const primaryNavPaths = ['/', '/internships', '/courses', '/sessions', '/campus-ambassador'];

export const moreNavigation = navigation.filter((item) => !primaryNavPaths.includes(item.path));

export const footerNavigation = {
  platform: [
    { label: 'Browse Internships', path: '/internships' },
    { label: 'Explore Courses', path: '/courses' },
    { label: 'Sessions & Webinars', path: '/sessions' },
    { label: 'Campus Ambassador', path: '/campus-ambassador' },
    { label: 'Student Projects', path: '/projects' },
  ],
  account: [
    { label: 'Student Portal', path: '/portal/dashboard' },
    { label: 'Sign In', path: '/login' },
    { label: 'Create Account', path: '/register' },
    { label: 'Verify a Certificate', path: '/verify-certificate' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
    { label: 'Partner With Us', path: '/contact' },
  ],
};

export const socialLinks = siteConfig.social;
