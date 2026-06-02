import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageResponse } from "@/types/api.types";

interface Props<T> {
  data: PageResponse<T> | null;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  pageSizes?: number[];
}

export function PaginationBar<T>({
  data,
  page,
  size,
  onPageChange,
  onSizeChange,
  pageSizes = [7, 10, 20, 50],
}: Props<T>) {
  if (!data) return null;
  const total = data.totalElements ?? 0;
  const start = total === 0 ? 0 : page * size + 1;
  const end = Math.min(total, (page + 1) * size);
  const last = data.last ?? page + 1 >= data.totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 text-xs text-muted-foreground">
      <span>
        Showing <span className="font-medium text-foreground">{start}–{end}</span> of {total}
      </span>
      <div className="flex items-center gap-2">
        {onSizeChange && (
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </Button>
        <span>
          Page {page + 1} of {Math.max(1, data.totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={last}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default PaginationBar;
