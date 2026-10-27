/**
 * Contact-message store helpers (localStorage-backed, shared with the mock DB seed).
 * Swaps to `messageService` calls once the FastAPI backend exposes /messages.
 */
import { readStore, writeStore, generateId } from './api';
import { MESSAGES_STORAGE_KEY } from '../utils/constants';
import { notifyMessagesUpdated } from './events';

export const readMessages = () => readStore(MESSAGES_STORAGE_KEY);

const persist = (messages) => {
  writeStore(MESSAGES_STORAGE_KEY, messages);
  notifyMessagesUpdated();
};

export const messageService = {
  markRead(id, read = true) {
    persist(readMessages().map((m) => (m.id === id ? { ...m, read } : m)));
  },

  remove(id) {
    persist(readMessages().filter((m) => m.id !== id));
  },

  add(message) {
    const record = {
      id: generateId('msg'),
      createdAt: new Date().toISOString(),
      read: false,
      ...message,
    };
    persist([record, ...readMessages()]);
    return record;
  },
};
