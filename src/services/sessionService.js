import { request, readStore, writeStore, generateId } from './api';
import { sessions } from '../data/sessions';
import { SESSION_REGISTRATIONS_STORAGE_KEY } from '../utils/constants';
import { notifySessionsUpdated } from './events';

const getRegistrations = () => readStore(SESSION_REGISTRATIONS_STORAGE_KEY);

export const sessionService = {
  async getAll() {
    // emptyResult keeps the production shell honest: no backend → "nothing announced yet".
    return request('/sessions', { mockHandler: () => sessions, emptyResult: [] });
  },

  async getById(id) {
    return request(`/sessions/${id}`, {
      mockHandler: () => {
        const session = sessions.find((s) => s.id === id);
        if (!session) throw new Error('Session not found.');
        return session;
      },
      emptyResult: null,
    });
  },

  /** Sessions the given user is already registered for (mock mode). */
  isRegistered(email, sessionId) {
    return getRegistrations().some((r) => r.email === email && r.sessionId === sessionId);
  },

  async register({ sessionId, email, name }) {
    return request('/session-registrations', {
      method: 'POST',
      body: { sessionId, email, name },
      mockHandler: () => {
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) throw new Error('Session not found.');
        if (session.status === 'Completed') throw new Error('This session has already ended.');
        if (getRegistrations().some((r) => r.email === email && r.sessionId === sessionId)) {
          throw new Error('You are already registered for this session.');
        }
        const record = {
          id: generateId('reg'),
          sessionId,
          sessionTitle: session.title,
          email,
          name,
          registeredAt: new Date().toISOString(),
        };
        writeStore(SESSION_REGISTRATIONS_STORAGE_KEY, [record, ...getRegistrations()]);
        notifySessionsUpdated();
        return record;
      },
    });
  },

  async getRegistrationsFor(email) {
    return request('/session-registrations', {
      mockHandler: () => getRegistrations().filter((r) => r.email === email),
      emptyResult: [],
    });
  },
};
