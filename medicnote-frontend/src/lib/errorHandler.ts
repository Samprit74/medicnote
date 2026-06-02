import { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Normalize an Axios error into a stable shape for inline rendering.
 * Used by pages that need to show errors inside the page (not just a toast).
 */
export interface NormalizedError {
  message: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}

type ErrorBody = {
  message?: string;
  messages?: Record<string, string>;
  error?: string;
  status?: number;
};

export function normalizeError(err: unknown): NormalizedError {
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axErr = err as AxiosError<ErrorBody>;
    const data = axErr.response?.data;
    if (axErr.code === "ERR_NETWORK" || !axErr.response) {
      return {
        message: "Network error. Please check your connection.",
        status: 0,
      };
    }
    const message = data?.message ?? data?.error ?? axErr.message ?? "Request failed";
    return {
      message,
      fieldErrors: data?.messages,
      status: axErr.response.status,
    };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: "Unknown error" };
}

export function extractApiError(err: unknown): { message: string; fieldErrors?: Record<string, string> } {
  return normalizeError(err);
}

/**
 * Show a toast for an error and rethrow the normalized form so callers can branch.
 * Use this when the page wants the toast AND inline state.
 */
export function handleApiError(err: unknown, fallback = "Something went wrong"): never {
  const norm = normalizeError(err);
  toast.error(norm.message || fallback);
  throw norm;
}
