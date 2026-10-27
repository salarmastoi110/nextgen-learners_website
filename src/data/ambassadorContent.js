/**
 * Campus Ambassador portal content — configurable, single source of truth.
 * Only list resources/announcements that genuinely exist; admins replace
 * these once the CMS/backend is connected.
 */
export const ambassadorResources = [
  {
    icon: '📣',
    title: 'Campaign Posters',
    desc: 'Official webinar and internship posters for campus sharing. New posters are added with every announced event.',
    action: null, // no file exists yet — show as "Coming with each announcement"
  },
  {
    icon: '📝',
    title: 'Approved Captions',
    desc: 'Ready-to-post captions for WhatsApp, Instagram and LinkedIn that follow NGL brand voice.',
    action: null,
  },
  {
    icon: '📊',
    title: 'Event Report Template',
    desc: 'The standard one-page report format ambassadors submit after each campus activity.',
    action: null,
  },
  {
    icon: '🎯',
    title: 'Ambassador Playbook',
    desc: 'A short guide to running awareness sessions, answering student questions and escalating issues to the NGL team.',
    action: null,
  },
];

export const ambassadorAnnouncements = [
  {
    date: '2026-10-25',
    title: 'Generative AI webinar registration is open',
    body: 'Promo materials for the Nov 12 webinar are now available in your tasks.',
  },
  {
    date: '2026-10-20',
    title: 'Fall internship announcements published',
    body: 'New verified internship openings are live — share them with your campus groups.',
  },
];

/** Achievement rules — earned status is computed from genuine approved records. */
export const ambassadorAchievements = [
  { id: 'first-approval', icon: '🌟', title: 'First Approval', desc: 'Have your first task approved by an admin.', threshold: 1, metric: 'approvedTasks' },
  { id: 'ten-points', icon: '🎯', title: 'Getting Started', desc: 'Earn your first 10 official points.', threshold: 10, metric: 'points' },
  { id: 'five-tasks', icon: '🔥', title: 'Consistent Contributor', desc: 'Get 5 tasks approved.', threshold: 5, metric: 'approvedTasks' },
  { id: 'hundred-points', icon: '🏆', title: 'Century Club', desc: 'Reach 100 approved points.', threshold: 100, metric: 'points' },
];
