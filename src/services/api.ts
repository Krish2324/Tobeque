import axios from 'axios';

/**
 * Axios instance for the frontend-website.
 * All /api/* requests are proxied to the backend (http://localhost:5000)
 * via vite.config.ts during development — no CORS issues.
 * No auth token is attached here since product GET routes are public.
 */
const api = axios.create({
  baseURL: '',       // Empty — Vite dev proxy handles /api routing
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
