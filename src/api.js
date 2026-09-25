import axios from 'axios';
import { API_URL } from './config';

/**
 * Shared axios instance for all authenticated API calls.
 *
 * - Automatically attaches the Bearer token from localStorage to every request.
 * - Automatically clears the token and redirects to login on ANY 401 response
 *   (expired token, invalid token, or no token at all) from anywhere in the app.
 *
 * Use this instead of importing axios directly in pages that call protected
 * routes (DashboardPage, HistoryPage, etc.).
 */
const api = axios.create({
  baseURL: API_URL,
});

// Attach the token automatically so you no longer need to pass
// `{ headers: { Authorization: `Bearer ${token}` } }` manually on every call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Catch any 401 from any request, anywhere, and force a clean re-login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Using a hard redirect (not useNavigate) because this file lives
      // outside React's component tree / Router context.
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;