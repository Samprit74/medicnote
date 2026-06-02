import { useCallback, useState } from "react";
import type { PageResponse } from "@/types/api.types";
import { useApi, UseApiResult } from "./useApi";

export interface UsePaginatedOptions {
  initialPage?: number;
  initialSize?: number;
}

export interface UsePaginatedResult<T> extends UseApiResult<PageResponse<T>> {
  page: number;
  setPage: (p: number) => void;
  size: number;
  setSize: (s: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

/**
 * Wraps `useApi` with page/size state for paginated endpoints.
 * Pass an endpoint factory that takes `(page, size)` and returns a promise.
 */
export function usePaginated<T>(
  fetcherFactory: (page: number, size: number) => ReturnType<Parameters<typeof useApi<PageResponse<T>>>[0]>,
  options: UsePaginatedOptions = {}
): UsePaginatedResult<T> {
  const { initialPage = 0, initialSize = 7 } = options;
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const result = useApi<PageResponse<T>>(
    useCallback(() => fetcherFactory(page, size), [fetcherFactory, page, size]),
    [page, size]
  );

  const goNext = useCallback(
    () => setPage((p) => (result.data && !result.data.last ? p + 1 : p)),
    [result.data]
  );
  const goPrev = useCallback(
    () => setPage((p) => (p > 0 ? p - 1 : p)),
    []
  );

  return { ...result, page, setPage, size, setSize, goNext, goPrev };
}
