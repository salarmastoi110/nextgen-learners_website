/**
 * DEV-ONLY FIXTURES — sessions & webinars.
 * These records are ONLY surfaced through sessionService's mockHandler
 * (dev server or VITE_USE_MOCK=1). A production build without a backend
 * renders a polished empty state instead of this data.
 * Real events must be created by administrators once the backend/CMS is connected.
 */
export const sessions = [
  {
    id: 'ngl-session-ai-tools',
    type: 'Webinar',
    status: 'Open',
    title: 'Generative AI for Students',
    topic: 'Artificial Intelligence',
    summary:
      'A hands-on webinar showing how to use modern AI tools for study, research, projects and productivity — responsibly.',
    speaker: { name: 'Haris Jamal', role: 'AI Engineer, NextGen Learners' },
    date: '2026-11-12',
    time: '20:00',
    durationMins: 90,
    mode: 'Online',
    registrationDeadline: '2026-11-11',
    skills: ['Prompt Engineering', 'AI Tools', 'Productivity'],
    icon: '✨',
    gradient: 'linear-gradient(135deg, #0d9488, #4f46e5)',
  },
  {
    id: 'ngl-session-datastory',
    type: 'Workshop',
    status: 'Open',
    title: 'Data Storytelling with Python',
    topic: 'Data Science',
    summary:
      'Turn raw CSV files into clear visual stories. Bring a laptop — we clean, analyse and chart a real dataset together.',
    speaker: { name: 'Sana Mir', role: 'Data Scientist, NextGen Learners' },
    date: '2026-11-22',
    time: '17:00',
    durationMins: 180,
    mode: 'Hybrid',
    registrationDeadline: '2026-11-20',
    skills: ['Python', 'Pandas', 'Matplotlib'],
    icon: '📊',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  },
  {
    id: 'ngl-session-resume',
    type: 'Live Session',
    status: 'Upcoming',
    title: 'Resume & Portfolio Clinic',
    topic: 'Career Guidance',
    summary:
      'A live review session: what a strong student resume looks like, common mistakes, and a portfolio that gets replies.',
    speaker: { name: 'NGL Mentors', role: 'Career Services Team' },
    date: '2026-12-03',
    time: '21:00',
    durationMins: 60,
    mode: 'Online',
    registrationDeadline: null,
    skills: ['Career', 'Resume', 'LinkedIn'],
    icon: '💼',
    gradient: 'linear-gradient(135deg, #db2777, #f97316)',
  },
  {
    id: 'ngl-session-webperf',
    type: 'Technical Session',
    status: 'Completed',
    title: 'Web Performance Fundamentals',
    topic: 'Web Development',
    summary:
      'Core Web Vitals, lazy loading and bundle analysis — recorded and shared with attendees after the session.',
    speaker: { name: 'Owais Ahmed', role: 'Frontend Lead, NextGen Learners' },
    date: '2026-09-18',
    time: '20:00',
    durationMins: 75,
    mode: 'Online',
    registrationDeadline: '2026-09-17',
    skills: ['React', 'Vite', 'Performance'],
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #0284c7, #22d3ee)',
  },
];
