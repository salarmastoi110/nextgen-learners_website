import { request, readStore, writeStore, generateId } from './api';
import { AUTH_STORAGE_KEY } from '../utils/constants';

/** Certificates issued by NextGen Learners (mock — the backend will own this registry). */
const SEED_REGISTRY = [
  { code: 'NGL-PY-2026-0417', holder: 'Ayesha Khan', courseTitle: 'Python for Data Analytics', issuedAt: '2026-09-30T00:00:00Z', status: 'Valid' },
  { code: 'NGL-WD-2026-1130', holder: 'Bilal Ahmed', courseTitle: 'Modern Web Development with React', issuedAt: '2026-08-18T00:00:00Z', status: 'Valid' },
  { code: 'NGL-DS-2025-0921', holder: 'Hina Fatima', courseTitle: 'Data Science Internship Program', issuedAt: '2025-12-21T00:00:00Z', status: 'Valid' },
  { code: 'NGL-UX-2026-0764', holder: 'Omar Farooq', courseTitle: 'UI/UX Design Fundamentals', issuedAt: '2026-06-04T00:00:00Z', status: 'Revoked' },
];

const REGISTRY_KEY = 'ngl_certificates';

/** Read the live registry, seeding it from defaults on first access. */
const loadRegistry = () => {
  if (localStorage.getItem(REGISTRY_KEY) === null) {
    writeStore(REGISTRY_KEY, SEED_REGISTRY);
    return [...SEED_REGISTRY];
  }
  return readStore(REGISTRY_KEY, []);
};

const saveRegistry = (rows) => writeStore(REGISTRY_KEY, rows);

export const certificateService = {
  /** Full issuance registry (admin view). */
  async getAll() {
    return request('/certificates', { mockHandler: () => loadRegistry() });
  },

  /** Issue a new certificate and generate a verification code. */
  async issue({ holder, courseTitle }) {
    return request('/certificates', {
      method: 'POST',
      body: { holder, courseTitle },
      mockHandler: (body) => {
        const prefix = body.courseTitle.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'NG';
        const code = `NGL-${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const record = {
          id: generateId('cert'),
          code,
          holder: body.holder,
          courseTitle: body.courseTitle,
          issuedAt: new Date().toISOString(),
          status: 'Valid',
        };
        saveRegistry([record, ...loadRegistry()]);
        return record;
      },
    });
  },

  async setStatus(code, status) {
    return request(`/certificates/${code}`, {
      method: 'PATCH',
      body: { status },
      mockHandler: (body) => {
        const next = loadRegistry().map((c) => (c.code === code ? { ...c, status: body.status } : c));
        saveRegistry(next);
        return next.find((c) => c.code === code);
      },
    });
  },

  async verify(code) {
    return request(`/certificates/verify/${code}`, {
      mockHandler: () => {
        const clean = String(code || '').trim().toUpperCase();
        if (!clean) throw new Error('Enter a certificate code.');
        const certificate = loadRegistry().find((c) => c.code === clean);
        if (!certificate) {
          return { found: false, message: 'No certificate matches this code. Double-check the ID.' };
        }
        return { found: true, certificate };
      },
    });
  },

  /** Certificates belonging to the logged-in student. */
  async getMyCertificates() {
    return request('/certificates/me', {
      mockHandler: () => {
        const user = readStore(AUTH_STORAGE_KEY, {}).user;
        const owned = readStore(AUTH_STORAGE_KEY, { certificates: [] }).certificates || [];
        const registry = loadRegistry();
        const byHolder = registry.filter((c) => user && c.holder === user.name);
        const merged = [...new Map([...owned, ...byHolder].map((c) => [c.code, c])).values()];
        return merged;
      },
    });
  },
};
