import axios from 'axios';

/**
 * Axios instance for the frontend-website.
 * All /api/* requests are proxied to the backend (http://localhost:5000)
 * via vite.config.ts during development — no CORS issues.
 * No auth token is attached here since product GET routes are public.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Uses ENV in prod, Vite proxy in dev
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
