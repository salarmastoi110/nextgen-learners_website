/**
 * Low-level API helper with three run modes:
 *
 *  1. BACKEND   — VITE_API_BASE_URL is set → real REST calls (with bearer token).
 *  2. DEV MOCK  — no backend and VITE_USE_MOCK=1 → localStorage mock handlers
 *                 (rich demo data; only ever enabled in development).
 *  3. PROD SHELL— no backend and mock disabled → list reads resolve to a polished
 *                 empty state, and any mutation/verification clearly reports that
 *                 the backend is not connected. No fake success is ever shown.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const HAS_BACKEND = !!API_BASE_URL;
// Demo data is used in the dev server automatically; production builds opt out
// (empty shell) unless VITE_USE_MOCK=1 is explicitly set.
const USE_MOCK = !HAS_BACKEND && (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === '1');

/** True when demo fixtures/mocks may be used (dev server or explicit opt-in). */
export const MOCK_ENABLED = USE_MOCK;

export const BACKEND_MESSAGE =
  'This feature needs the NextGen Learners backend, which is not connected yet.';

const latency = () => new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 300));

export async function request(endpoint, { method = 'GET', body = null, mockHandler, emptyResult } = {}) {
  if (HAS_BACKEND) {
    const token = localStorage.getItem('ngl_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed (${response.status})`);
    }
    return response.json();
  }

  if (USE_MOCK) {
    await latency();
    if (!mockHandler) throw new Error(`No mock handler registered for ${method} ${endpoint}`);
    return mockHandler(body);
  }

  // PROD SHELL: backend not connected.
  if (method === 'GET' && emptyResult !== undefined) return emptyResult;
  throw new Error(BACKEND_MESSAGE);
}

/* ---------- localStorage persistence helpers ---------- */

export const readStore = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const generateId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
