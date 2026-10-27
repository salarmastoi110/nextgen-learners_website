import { request, readStore, writeStore, generateId } from './api';
import { APPLICATIONS_STORAGE_KEY } from '../utils/constants';
import { notifyApplicationsUpdated } from './events';

const persist = (apps) => {
  writeStore(APPLICATIONS_STORAGE_KEY, apps);
  notifyApplicationsUpdated();
};

export const applicationService = {
  async getAll() {
    return request('/applications', {
      mockHandler: () => readStore(APPLICATIONS_STORAGE_KEY),
    });
  },

  async submit(application) {
    return request('/applications', {
      method: 'POST',
      body: application,
      mockHandler: (body) => {
        const apps = readStore(APPLICATIONS_STORAGE_KEY);
        if (apps.some((a) => a.internshipId === body.internshipId && a.applicantName === body.fullName)) {
          throw new Error('You have already applied for this internship.');
        }
        const record = {
          id: generateId('app'),
          internshipId: body.internshipId,
          internshipTitle: body.internshipTitle,
          applicantName: body.fullName,
          email: body.email,
          status: 'Submitted',
          appliedAt: new Date().toISOString(),
          coverLetter: body.coverLetter,
        };
        persist([record, ...apps]);
        return record;
      },
    });
  },

  async updateStatus(id, status) {
    return request(`/applications/${id}`, {
      method: 'PATCH',
      body: { status },
      mockHandler: (body) => {
        const apps = readStore(APPLICATIONS_STORAGE_KEY);
        const next = apps.map((a) => (a.id === id ? { ...a, status: body.status } : a));
        persist(next);
        return next.find((a) => a.id === id);
      },
    });
  },

  async remove(id) {
    return request(`/applications/${id}`, {
      method: 'DELETE',
      mockHandler: () => {
        persist(readStore(APPLICATIONS_STORAGE_KEY).filter((a) => a.id !== id));
        return { ok: true };
      },
    });
  },
};
