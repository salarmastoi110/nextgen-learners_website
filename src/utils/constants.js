export const APP_NAME = 'NextGen Learners';
export const APP_TAGLINE = 'Code • Learn • Innovate • Succeed';

export const ROUTES = {
  HOME: '/',
  INTERNSHIPS: '/internships',
  INTERNSHIP_DETAILS: '/internships/:id',
  SESSIONS: '/sessions',
  CAMPUS_AMBASSADOR: '/campus-ambassador',
  VERIFY_CERTIFICATE: '/verify-certificate',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',
  SERVICES: '/services',
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:id',
  CONTACT: '/contact',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PORTAL: '/portal',
  PORTAL_DASHBOARD: '/portal/dashboard',
  PORTAL_BROWSE: '/portal/internships',
  PORTAL_MY_APPLICATIONS: '/portal/applications',
  PORTAL_MY_COURSES: '/portal/courses',
  PORTAL_MY_CERTIFICATES: '/portal/certificates',
  PORTAL_PROFILE: '/portal/profile',
  PORTAL_SETTINGS: '/portal/settings',
  ADMIN: '/admin',
  AMBASSADOR: '/ambassador',
};

export const INTERNSHIP_TYPES = ['Remote', 'On-site', 'Hybrid'];
export const INTERNSHIP_STATUS = ['Open', 'Closing Soon', 'Closed'];
export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const APPLICATION_STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

export const AUTH_STORAGE_KEY = 'ngl_auth_user';
export const PROFILES_STORAGE_KEY = 'ngl_profiles';
export const APPLICATIONS_STORAGE_KEY = 'ngl_applications';
export const ENROLLMENTS_STORAGE_KEY = 'ngl_enrollments';
export const MESSAGES_STORAGE_KEY = 'ngl_messages';
export const SESSION_REGISTRATIONS_STORAGE_KEY = 'ngl_session_registrations';
export const AMBASSADOR_TASKS_STORAGE_KEY = 'ngl_ambassador_tasks';
export const AMBASSADOR_SUBMISSIONS_STORAGE_KEY = 'ngl_ambassador_submissions';
export const AMBASSADOR_APPLICATIONS_STORAGE_KEY = 'ngl_ambassador_applications';

export const AMBASSADOR_TASK_STATUSES = ['Assigned', 'In Progress', 'Submitted', 'Approved', 'Revisions Required'];
export const AMBASSADOR_TASK_TYPES = ['Webinar Promotion', 'Internship Announcement', 'Campus Awareness Session', 'Event Report', 'Registrations Drive'];

export const DEMO_ACCOUNTS = [
  { email: 'student@nextgenlearners.com', password: 'student123', role: 'student', name: 'Ayesha Khan' },
  { email: 'ambassador@nextgenlearners.com', password: 'ambassador123', role: 'ambassador', name: 'Zain Abbas' },
  { email: 'admin@nextgenlearners.com', password: 'main', role: 'admin', name: 'NGL Admin' },
];
