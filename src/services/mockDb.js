/**
 * Central mock database for the frontend-only phase.
 * Seed records are written to localStorage once so portal/admin screens
 * feel real before the backend exists.
 */
import {
  APPLICATIONS_STORAGE_KEY,
  ENROLLMENTS_STORAGE_KEY,
  MESSAGES_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  PROFILES_STORAGE_KEY,
  AMBASSADOR_TASKS_STORAGE_KEY,
  AMBASSADOR_SUBMISSIONS_STORAGE_KEY,
} from '../utils/constants';
import { readStore, writeStore, generateId, MOCK_ENABLED } from './api';

const SEED_FLAG = 'ngl_seeded_v2';

const seedApplications = [
  {
    id: generateId('app'),
    internshipId: 'ngl-web-01',
    internshipTitle: 'Web Development Intern',
    applicantName: 'Ayesha Khan',
    email: 'student@nextgenlearners.com',
    status: 'Under Review',
    appliedAt: '2026-10-10T09:30:00Z',
    coverLetter: 'I have built three React projects and I am eager to learn production workflows.',
  },
  {
    id: generateId('app'),
    internshipId: 'ngl-ds-02',
    internshipTitle: 'Data Science Intern',
    applicantName: 'Ayesha Khan',
    email: 'student@nextgenlearners.com',
    status: 'Shortlisted',
    appliedAt: '2026-10-14T14:00:00Z',
    coverLetter: 'Strong Python and pandas background, completed the NGL Data Analytics course.',
  },
  {
    id: generateId('app'),
    internshipId: 'ngl-design-03',
    internshipTitle: 'UI/UX Design Intern',
    applicantName: 'Bilal Ahmed',
    email: 'bilal@example.com',
    status: 'Submitted',
    appliedAt: '2026-10-20T11:15:00Z',
    coverLetter: 'Figma certified with a portfolio of 8 mobile app designs.',
  },
  {
    id: generateId('app'),
    internshipId: 'ngl-ai-04',
    internshipTitle: 'AI/ML Intern',
    applicantName: 'Hina Fatima',
    email: 'hina@example.com',
    status: 'Selected',
    appliedAt: '2026-09-28T08:00:00Z',
    coverLetter: 'Built a sentiment-analysis pipeline deployed to 2k users.',
  },
];

const seedEnrollments = [
  { id: generateId('enr'), courseId: 'ngl-course-react', progress: 68, enrolledAt: '2026-09-02T10:00:00Z' },
  { id: generateId('enr'), courseId: 'ngl-course-python', progress: 100, enrolledAt: '2026-07-15T10:00:00Z' },
  { id: generateId('enr'), courseId: 'ngl-course-ux', progress: 24, enrolledAt: '2026-10-08T10:00:00Z' },
];

const seedCertificates = [
  {
    code: 'NGL-PY-2026-0417',
    holder: 'Ayesha Khan',
    courseTitle: 'Python for Data Analytics',
    issuedAt: '2026-09-30T00:00:00Z',
    status: 'Valid',
  },
];

const seedMessages = [
  {
    id: generateId('msg'),
    name: 'Omar Farooq',
    email: 'omar@example.com',
    subject: 'Internship for part-time students',
    message: 'Do you offer evening-hour internships for working students?',
    createdAt: '2026-10-21T16:40:00Z',
    read: false,
  },
  {
    id: generateId('msg'),
    name: 'Zara Ali',
    email: 'zara@example.com',
    subject: 'Course bundle discount',
    message: 'Is there a discount when enrolling in three courses at once?',
    createdAt: '2026-10-24T09:05:00Z',
    read: false,
  },
];

const seedProfiles = {
  'student@nextgenlearners.com': {
    id: 'demo-student',
    name: 'Ayesha Khan',
    email: 'student@nextgenlearners.com',
    role: 'student',
    joinedAt: '2026-06-01T00:00:00Z',
    phone: '+92 300 448 1290',
    bio: 'Final-year CS student passionate about front-end engineering and data storytelling.',
    skills: ['React', 'JavaScript', 'Python', 'Figma'],
  },
  'ambassador@nextgenlearners.com': {
    id: 'demo-ambassador',
    name: 'Zain Abbas',
    email: 'ambassador@nextgenlearners.com',
    role: 'ambassador',
    joinedAt: '2026-05-12T00:00:00Z',
    university: 'FAST NUCES, Karachi',
    program: 'Computer Science',
    year: '3rd Year',
    city: 'Karachi',
  },
  'admin@nextgenlearners.com': {
    id: 'demo-admin',
    name: 'NGL Admin',
    email: 'admin@nextgenlearners.com',
    role: 'admin',
    joinedAt: '2025-01-15T00:00:00Z',
  },
};

/* DEV-ONLY ambassador task fixtures (admin creates real tasks once a backend exists). */
const seedAmbassadorTasks = [
  {
    id: generateId('tsk'),
    title: 'Promote the “Generative AI for Students” webinar',
    type: 'Webinar Promotion',
    description: 'Share the official poster across your class groups and campus story. Submit a short report with reach estimates.',
    points: 20,
    deadline: '2026-11-14',
    createdBy: 'NGL Admin',
    createdAt: '2026-10-25T09:00:00Z',
    active: true,
  },
  {
    id: generateId('tsk'),
    title: 'Host a campus awareness booth',
    type: 'Campus Awareness Session',
    description: 'Run an approved NGL awareness booth at your campus cafeteria and collect feedback from at least 25 students.',
    points: 40,
    deadline: '2026-11-30',
    createdBy: 'NGL Admin',
    createdAt: '2026-10-20T09:00:00Z',
    active: true,
  },
  {
    id: generateId('tsk'),
    title: 'Share the Fall internship announcement',
    type: 'Internship Announcement',
    description: 'Repost the official internship announcement with the campaign caption and report the responses you received.',
    points: 15,
    deadline: '2026-10-28',
    createdBy: 'NGL Admin',
    createdAt: '2026-10-15T09:00:00Z',
    active: true,
  },
];

const seedAmbassadorSubmissions = [
  {
    id: generateId('sub'),
    taskId: 'ngl-sample-task-4',
    taskTitle: 'Conduct an onboarding orientation at your campus',
    ambassadorEmail: 'zara.a@example.com',
    ambassadorName: 'Zara Abbas',
    description: 'Oriented 35 students on how to apply for internships via the NGL portal.',
    completionDate: '2026-09-25',
    evidenceUrl: 'https://instagram.com/example/orientation',
    status: 'Approved',
    pointsAwarded: 45,
    submittedAt: '2026-09-26T10:00:00Z',
    reviewedAt: '2026-09-28T10:00:00Z',
  },
  {
    id: generateId('sub'),
    taskId: 'ngl-sample-task-5',
    taskTitle: 'Webinar promotion drive',
    ambassadorEmail: 'fahad.m@example.com',
    ambassadorName: 'Fahad Malik',
    description: 'Promoted the AI Tools webinar across four college WhatsApp groups.',
    completionDate: '2026-10-02',
    evidenceUrl: 'https://instagram.com/example/promo',
    status: 'Approved',
    pointsAwarded: 38,
    submittedAt: '2026-10-03T10:00:00Z',
    reviewedAt: '2026-10-05T10:00:00Z',
  },
  {
    id: generateId('sub'),
    taskId: 'ngl-sample-task-6',
    taskTitle: 'Campus feedback survey',
    ambassadorEmail: 'zara.a@example.com',
    ambassadorName: 'Zara Abbas',
    description: 'Collected structured feedback from 20 students about course interest.',
    completionDate: '2026-10-15',
    evidenceUrl: null,
    status: 'Approved',
    pointsAwarded: 27,
    submittedAt: '2026-10-16T10:00:00Z',
    reviewedAt: '2026-10-18T10:00:00Z',
  },
];

export function ensureSeedData() {
  // Mock fixtures are a dev-only concern — never touch storage in the production shell.
  if (!MOCK_ENABLED) return;

  // Profiles are seeded idempotently so returning visitors also get demo data.
  if (localStorage.getItem(PROFILES_STORAGE_KEY) === null) {
    writeStore(PROFILES_STORAGE_KEY, seedProfiles);
  }

  if (localStorage.getItem(SEED_FLAG)) return;

  writeStore(APPLICATIONS_STORAGE_KEY, seedApplications);
  writeStore(ENROLLMENTS_STORAGE_KEY, seedEnrollments);
  writeStore(MESSAGES_STORAGE_KEY, seedMessages);
  writeStore(AMBASSADOR_TASKS_STORAGE_KEY, seedAmbassadorTasks);
  writeStore(AMBASSADOR_SUBMISSIONS_STORAGE_KEY, seedAmbassadorSubmissions);

  localStorage.setItem(SEED_FLAG, '1');
}

/** Read a store key without seeding logic. */
export const getStore = (key, fallback = []) => readStore(key, fallback);
