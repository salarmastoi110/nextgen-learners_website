import { request, readStore, writeStore } from './api';
import { AUTH_STORAGE_KEY, PROFILES_STORAGE_KEY, DEMO_ACCOUNTS } from '../utils/constants';
import { generateId } from './api';

const getSession = () => readStore(AUTH_STORAGE_KEY, null);
const getProfiles = () => readStore(PROFILES_STORAGE_KEY, {});
const saveProfile = (profile) => writeStore(PROFILES_STORAGE_KEY, { ...getProfiles(), [profile.email]: profile });

export const authService = {
  async login({ email, password }) {
    return request('/auth/login', {
      method: 'POST',
      body: { email, password },
      mockHandler: () => {
        const account = DEMO_ACCOUNTS.find(
          (a) => a.email === email.trim().toLowerCase() && a.password === password
        );
        if (!account) throw new Error('Invalid email or password.');
        const cleanEmail = account.email;
        const user = getProfiles()[cleanEmail] || {
          id: generateId('usr'),
          name: account.name,
          email: cleanEmail,
          role: account.role,
          joinedAt: new Date().toISOString(),
        };
        saveProfile(user);
        writeStore(AUTH_STORAGE_KEY, { user, certificates: getSession()?.certificates || [] });
        return user;
      },
    });
  },

  async register({ name, email, password }) {
    return request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      mockHandler: () => {
        const cleanEmail = email.trim().toLowerCase();
        if (DEMO_ACCOUNTS.some((a) => a.email === cleanEmail)) {
          throw new Error('An account with this email already exists.');
        }
        const user = {
          id: generateId('usr'),
          name,
          email: cleanEmail,
          role: 'student',
          joinedAt: new Date().toISOString(),
        };
        saveProfile(user);
        writeStore(AUTH_STORAGE_KEY, { user, certificates: [] });
        return user;
      },
    });
  },

  async logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /** Synchronous session read for route guards. */
  getCurrentUser() {
    return getSession()?.user || null;
  },

  async updateProfile(updates) {
    return request('/auth/profile', {
      method: 'PATCH',
      body: updates,
      mockHandler: () => {
        const session = getSession();
        if (!session) throw new Error('Not authenticated.');
        session.user = { ...session.user, ...updates };
        writeStore(AUTH_STORAGE_KEY, session);
        saveProfile(session.user);
        return session.user;
      },
    });
  },

  async requestPasswordReset(email) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      mockHandler: () => ({ message: `Reset instructions sent to ${email}` }),
    });
  },
};
