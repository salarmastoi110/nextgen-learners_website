import { request } from './api';
import { internships } from '../data/internships';

export const internshipService = {
  async getAll() {
    return request('/internships', { mockHandler: () => internships });
  },

  async getById(id) {
    return request(`/internships/${id}`, {
      mockHandler: () => {
        const internship = internships.find((i) => i.id === id);
        if (!internship) throw new Error('Internship not found.');
        return internship;
      },
    });
  },

  async search(term) {
    const all = await this.getAll();
    const q = term.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.skills.some((s) => s.toLowerCase().includes(q))
    );
  },
};
