/**
 * Generic API contracts. Mirrors the shape Spring returns.
 */

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiErrorBody {
  message?: string;
  messages?: Record<string, string>;
  error?: string;
  status?: number;
  timestamp?: string;
}

export interface SortParam {
  field: string;
  direction?: "asc" | "desc";
}

export type Id = number | string;
