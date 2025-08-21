import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",  // your Django backend
  withCredentials: true,             // send cookies (csrftoken, sessionid)
});

// Configure CSRF defaults (Django uses these by default)
api.defaults.xsrfCookieName = "csrftoken";
api.defaults.xsrfHeaderName = "X-CSRFToken";

/**
 * Utility: Get CSRF token from cookie
 */
function getCSRFTokenFromCookie(): string | null {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Utility: Refresh CSRF token from Django
 * Django must have a view with @ensure_csrf_cookie
 */
async function refreshCSRFToken() {
  try {
    await api.get("/csrf/"); // sets a new csrftoken cookie
    const csrf_token = getCSRFTokenFromCookie();
    return csrf_token;
  } catch (err) {
    console.error("Failed to refresh CSRF token:", err);
  }
}

/**
 * Axios Response Interceptor
 * - If Django rejects with 403 (CSRF token missing/expired),
 *   try to refresh token and retry the request once.
 */

api.interceptors.request.use((config) => {
  const csrf_token = getCSRFTokenFromCookie();
  if (csrf_token) {
    config.headers["X-CSRFToken"] = csrf_token;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response, // pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // prevent infinite loop

      console.warn("CSRF token expired or invalid, refreshing...");

      const csrf_token = await refreshCSRFToken();
      if (csrf_token) {
        originalRequest.headers["X-CSRFToken"] = csrf_token;
      }

      // Retry the original request with new token
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;