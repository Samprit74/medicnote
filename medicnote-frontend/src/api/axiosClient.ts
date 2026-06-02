import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

/**
 * Centralized Axios instance for the whole app.
 *
 * - baseURL from `VITE_API_BASE_URL` (e.g. `http://localhost:8080`).
 * - Attaches `Authorization: Bearer <token>` to every request when a token is present.
 * - On response errors:
 *    - 401  → clear token, route to /login, toast "Session expired".
 *    - 403  → route to /forbidden, toast "Access denied".
 *    - 5xx  → toast a generic "Server error" (uses backend message when available).
 *    - 4xx  → toast the backend `message` (or field map) if present.
 *    - network/timeout → toast "Network error".
 *
 * The interceptor does NOT swallow the error — pages can still branch on it.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ------------------------------------------------------------------
// Request interceptor — attach JWT
// ------------------------------------------------------------------
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------------
// Response interceptor — central error handling
// ------------------------------------------------------------------
type ErrorBody = {
  message?: string;
  messages?: Record<string, string>;
  error?: string;
  status?: number;
  timestamp?: string;
};

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const body = data as ErrorBody;
    if (body.message) return body.message;
    if (body.messages) {
      const entries = Object.entries(body.messages);
      if (entries.length) {
        return entries
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("\n");
      }
    }
    if (body.error) return body.error;
  }
  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }
  return fallback;
}

let hasShownAuthToast = false;
function safeToastError(message: string) {
  // Throttle identical auth messages to avoid loops when many requests 401 at once.
  if (hasShownAuthToast) return;
  hasShownAuthToast = true;
  toast.error(message);
  setTimeout(() => {
    hasShownAuthToast = false;
  }, 1500);
}

function go(path: string) {
  if (typeof window !== "undefined" && window.location.pathname !== path) {
    window.location.assign(path);
  }
}

/**
 * Internal flags a request can set to opt out of the global 401/403 redirects
 * and auto-toasts. Used when the caller wants to render the error inline.
 *
 * Example:
 *   patientService.searchPatients(kw, p, s, { silent403: true })
 *   → mark this call so the interceptor returns the error without bouncing
 *     to /forbidden and without showing a global toast.
 */
declare module "axios" {
  export interface AxiosRequestConfig {
    __silent403?: boolean;
  }
}

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorBody>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (error.code === "ERR_NETWORK" || !error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem("token");
      safeToastError("Session expired. Please log in again.");
      go("/login");
      return Promise.reject(error);
    }

    if (status === 403) {
      if (error.config?.__silent403) {
        // Caller wants the error returned so it can render inline.
        return Promise.reject(error);
      }
      // Toast only — do NOT redirect to /forbidden. The /forbidden page is
      // meant for direct navigation (e.g. cross-role access via ProtectedRoute).
      // A 403 from an API call is a per-action error, not a session-level
      // one, so the user stays on the current page and can read the toast.
      safeToastError(
        extractMessage(data, "Access denied. You don't have permission for this action.")
      );
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error(extractMessage(data, "Resource not found"));
      return Promise.reject(error);
    }

    if (status === 400 || status === 409) {
      toast.error(extractMessage(data, "Bad request"));
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      toast.error(extractMessage(data, "Server error. Please try again."));
      return Promise.reject(error);
    }

    // Anything else: surface whatever backend said.
    toast.error(extractMessage(data, "Request failed"));
    return Promise.reject(error);
  }
);

export default axiosClient;
export { extractMessage };
