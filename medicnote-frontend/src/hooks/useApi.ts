
import { useCallback, useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { normalizeError } from "@/lib/errorHandler";
import type { NormalizedError } from "@/lib/errorHandler";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: NormalizedError | null;
  refetch: () => void;
  setData: (value: T | null) => void;
}

/**
 * Generic data-fetching hook.
 *
 * - Calls fetcher() on mount and whenever deps change.
 * - Returns data, loading, error, refetch, and setData.
 * - Prevents state updates after the effect is cleaned up.
 */
export function useApi<T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  deps: ReadonlyArray<unknown> = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<NormalizedError | null>(null);
  const [tick, setTick] = useState<number>(0);

  const refetch = useCallback(() => {
    setTick((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetcher()
      .then((response) => {
        if (!cancelled) {
          setData(response.data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(normalizeError(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

    // Dependencies are controlled by the caller and refetch tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
}
