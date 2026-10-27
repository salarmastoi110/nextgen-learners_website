/**
 * Announce store updates across components (portal + admin share the same data).
 */
const APPS_UPDATED = 'ngl:applications-updated';
const ENROLLMENTS_UPDATED = 'ngl:enrollments-updated';
const MESSAGES_UPDATED = 'ngl:messages-updated';
const SESSIONS_UPDATED = 'ngl:sessions-updated';

const makeEventPair = (name) => [
  () => window.dispatchEvent(new Event(name)),
  (handler) => {
    window.addEventListener(name, handler);
    return () => window.removeEventListener(name, handler);
  },
];

const [notifyApplicationsUpdated, onApplicationsUpdated] = makeEventPair(APPS_UPDATED);
const [notifyEnrollmentsUpdated, onEnrollmentsUpdated] = makeEventPair(ENROLLMENTS_UPDATED);
const [notifyMessagesUpdated, onMessagesUpdated] = makeEventPair(MESSAGES_UPDATED);
const [notifySessionsUpdated, onSessionsUpdated] = makeEventPair(SESSIONS_UPDATED);

export {
  notifyApplicationsUpdated,
  onApplicationsUpdated,
  notifyEnrollmentsUpdated,
  onEnrollmentsUpdated,
  notifyMessagesUpdated,
  onMessagesUpdated,
  notifySessionsUpdated,
  onSessionsUpdated,
};
