import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Family of skeleton blocks used while data is loading.
 * Each is a small, theme-faithful placeholder for a real component.
 */

export const CardSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={`rounded-xl border border-border bg-card p-5 ${className ?? ""}`}>
    <Skeleton className="mb-3 h-4 w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="mb-2 h-3"
        style={{ width: `${100 - i * 8}%` }}
      />
    ))}
  </div>
);

export const RowSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-3 px-5 py-4 ${className ?? ""}`}>
    <Skeleton className="h-9 w-9 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-5 w-16" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <div className={`rounded-xl border border-border bg-card ${className ?? ""}`}>
    <div className="border-b border-border px-5 py-3">
      <Skeleton className="h-3 w-1/4" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <RowSkeleton key={i} className={i < rows - 1 ? "border-b border-border" : ""} />
    ))}
  </div>
);

export const CardGridSkeleton: React.FC<{ cards?: number; className?: string }> = ({
  cards = 6,
  className,
}) => (
  <div
    className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}
  >
    {Array.from({ length: cards }).map((_, i) => (
      <CardSkeleton key={i} lines={3} />
    ))}
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <Skeleton className="mb-3 h-3 w-1/3" />
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-32 w-full rounded-2xl" />
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <CardSkeleton lines={4} />
      <CardSkeleton lines={4} />
    </div>
  </div>
);
