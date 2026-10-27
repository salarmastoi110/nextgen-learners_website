/**
 * Lightweight CRUD store for admin-managed catalogs (internships, courses, projects).
 *
 * Each catalog is seeded once from its static data module into localStorage, after
 * which the admin panel edits the persisted copy. When the FastAPI backend is ready,
 * these helpers map 1:1 onto REST endpoints and this file can be deleted.
 */
import { readStore, writeStore, generateId } from './api';

export const createCatalog = (storageKey, seed) => {
  const key = `ngl_admin_${storageKey}`;

  const load = () => {
    const existing = localStorage.getItem(key);
    if (existing === null) {
      writeStore(key, seed);
      return [...seed];
    }
    return readStore(key, []);
  };

  const save = (items) => {
    writeStore(key, items);
    return items;
  };

  return {
    load,

    add(item) {
      const record = { id: generateId(storageKey), status: 'Open', ...item };
      save([record, ...load()]);
      return record;
    },

    update(id, patch) {
      const next = load().map((it) => (it.id === id ? { ...it, ...patch } : it));
      save(next);
      return next.find((it) => it.id === id);
    },

    remove(id) {
      save(load().filter((it) => it.id !== id));
    },

    reset() {
      save([...seed]);
    },
  };
};
