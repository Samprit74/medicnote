import { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { normalizeError, NormalizedError } from "@/lib/errorHandler";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: NormalizedError | null;
  refetch: () => void;
  setData: (v: T | null) => void;
}

/**
 * Generic data-fetching hook.
 * - Calls `fetcher()` on mount and whenever `deps` change.
 * - Returns `{ data, loading, error, refetch, setData }`.
 * - The Axios response interceptor already toasts on errors, so the
 *   page decides whether to also render `error` inline.
 */
export function useApi<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  deps: ReadonlyArray<unknown> = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<NormalizedError | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(normalizeError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, refetch, setData };
}
