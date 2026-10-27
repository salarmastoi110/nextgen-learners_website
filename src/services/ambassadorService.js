import { request, readStore, writeStore, generateId } from './api';
import {
  AMBASSADOR_TASKS_STORAGE_KEY,
  AMBASSADOR_SUBMISSIONS_STORAGE_KEY,
  AMBASSADOR_APPLICATIONS_STORAGE_KEY,
} from '../utils/constants';

const getTasks = () => readStore(AMBASSADOR_TASKS_STORAGE_KEY);
const getSubmissions = () => readStore(AMBASSADOR_SUBMISSIONS_STORAGE_KEY);
const getApplications = () => readStore(AMBASSADOR_APPLICATIONS_STORAGE_KEY);

export const ambassadorService = {
  /* ---------- tasks ---------- */
  async getTasks() {
    return request('/ambassador/tasks', { mockHandler: () => getTasks().filter((t) => t.active), emptyResult: [] });
  },

  async createTask(task) {
    return request('/ambassador/tasks', {
      method: 'POST',
      body: task,
      mockHandler: () => {
        const record = {
          id: generateId('tsk'),
          ...task,
          createdBy: 'Admin',
          createdAt: new Date().toISOString(),
          active: true,
        };
        writeStore(AMBASSADOR_TASKS_STORAGE_KEY, [record, ...getTasks()]);
        return record;
      },
    });
  },

  /* ---------- submissions ---------- */
  async getSubmissions(email) {
    return request('/ambassador/submissions', {
      mockHandler: () => getSubmissions().filter((s) => s.ambassadorEmail === email),
      emptyResult: [],
    });
  },

  async submitTask({ taskId, email, name, description, completionDate, evidenceUrl, notes }) {
    return request('/ambassador/submissions', {
      method: 'POST',
      body: { taskId, email, name, description, completionDate, evidenceUrl, notes },
      mockHandler: () => {
        const task = getTasks().find((t) => t.id === taskId);
        if (!task) throw new Error('Task not found. Please pick an active task.');
        if (getSubmissions().some((s) => s.taskId === taskId && s.ambassadorEmail === email && s.status !== 'Revisions Required')) {
          throw new Error('You have already submitted this task.');
        }
        const record = {
          id: generateId('sub'),
          taskId,
          taskTitle: task.title,
          ambassadorEmail: email,
          ambassadorName: name,
          description,
          completionDate,
          evidenceUrl: evidenceUrl || null,
          notes: notes || '',
          status: 'Submitted',
          pointsAwarded: 0,
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
        };
        writeStore(AMBASSADOR_SUBMISSIONS_STORAGE_KEY, [record, ...getSubmissions()]);
        return record;
      },
    });
  },

  /** Admin-only review: approve (award points) or request revisions. */
  async reviewSubmission(submissionId, { decision, points, feedback }) {
    return request(`/ambassador/submissions/${submissionId}/review`, {
      method: 'PATCH',
      body: { decision, points, feedback },
      mockHandler: () => {
        const all = getSubmissions();
        const idx = all.findIndex((s) => s.id === submissionId);
        if (idx === -1) throw new Error('Submission not found.');
        if (!['Approved', 'Revisions Required'].includes(decision)) {
          throw new Error('Invalid review decision.');
        }
        all[idx] = {
          ...all[idx],
          status: decision,
          pointsAwarded: decision === 'Approved' ? Number(points) || 0 : 0,
          reviewFeedback: feedback || '',
          reviewedAt: new Date().toISOString(),
        };
        writeStore(AMBASSADOR_SUBMISSIONS_STORAGE_KEY, all);
        return all[idx];
      },
    });
  },

  /* ---------- points, leaderboard, achievements ---------- */
  async getPoints(email) {
    return request('/ambassador/points', {
      mockHandler: () =>
        getSubmissions()
          .filter((s) => s.ambassadorEmail === email && s.status === 'Approved')
          .reduce((sum, s) => sum + (s.pointsAwarded || 0), 0),
      emptyResult: 0,
    });
  },

  async getLeaderboard() {
    return request('/ambassador/leaderboard', {
      mockHandler: () => {
        const byEmail = {};
        getSubmissions()
          .filter((s) => s.status === 'Approved')
          .forEach((s) => {
            const entry = (byEmail[s.ambassadorEmail] ||= {
              name: s.ambassadorName,
              email: s.ambassadorEmail,
              points: 0,
              approvedTasks: 0,
            });
            entry.points += s.pointsAwarded || 0;
            entry.approvedTasks += 1;
          });
        return Object.values(byEmail).sort((a, b) => b.points - a.points);
      },
      emptyResult: [],
    });
  },

  /* ---------- ambassador applications ---------- */
  async apply(application) {
    return request('/ambassador/applications', {
      method: 'POST',
      body: application,
      mockHandler: () => {
        const email = application.email.trim().toLowerCase();
        if (getApplications().some((a) => a.email === email)) {
          throw new Error('You have already applied for the ambassador program.');
        }
        const record = {
          id: generateId('ambapp'),
          ...application,
          email,
          status: 'Submitted',
          appliedAt: new Date().toISOString(),
        };
        writeStore(AMBASSADOR_APPLICATIONS_STORAGE_KEY, [record, ...getApplications()]);
        return record;
      },
    });
  },

  async getApplication(email) {
    return request('/ambassador/applications', {
      mockHandler: () =>
        getApplications().find((a) => a.email === email.trim().toLowerCase()) || null,
      emptyResult: null,
    });
  },

  async getApplications() {
    return request('/ambassador/applications', {
      mockHandler: () => getApplications(),
      emptyResult: [],
    });
  },
};
