import { request, readStore, writeStore, generateId } from './api';
import { courses } from '../data/courses';
import { ENROLLMENTS_STORAGE_KEY } from '../utils/constants';
import { notifyEnrollmentsUpdated } from './events';

export const courseService = {
  async getAll() {
    return request('/courses', { mockHandler: () => courses });
  },

  async getById(id) {
    return request(`/courses/${id}`, {
      mockHandler: () => {
        const course = courses.find((c) => c.id === id);
        if (!course) throw new Error('Course not found.');
        return course;
      },
    });
  },

  async getEnrollments() {
    return request('/enrollments', {
      mockHandler: () => readStore(ENROLLMENTS_STORAGE_KEY),
    });
  },

  async enroll(courseId) {
    return request('/enrollments', {
      method: 'POST',
      body: { courseId },
      mockHandler: () => {
        const enrollments = readStore(ENROLLMENTS_STORAGE_KEY);
        if (enrollments.some((e) => e.courseId === courseId)) {
          throw new Error('You are already enrolled in this course.');
        }
        const record = {
          id: generateId('enr'),
          courseId,
          progress: 0,
          enrolledAt: new Date().toISOString(),
        };
        writeStore(ENROLLMENTS_STORAGE_KEY, [record, ...enrollments]);
        notifyEnrollmentsUpdated();
        return record;
      },
    });
  },
};
