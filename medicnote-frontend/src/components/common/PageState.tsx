import React from "react";
import { SectionLoader } from "./SectionLoader";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import {
  CardSkeleton,
  TableSkeleton,
  CardGridSkeleton,
  StatCardSkeleton,
  DashboardSkeleton,
} from "./Skeletons";

export type LoadingKind = "spinner" | "card" | "table" | "cards" | "stats" | "dashboard";

interface Props {
  loading: boolean;
  error?: { message?: string } | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
  /** Which skeleton to show while loading. Defaults to a small spinner. */
  loadingKind?: LoadingKind;
}

const SkeletonFor: React.FC<{ kind: LoadingKind }> = ({ kind }) => {
  switch (kind) {
    case "card":
      return <CardSkeleton />;
    case "table":
      return <TableSkeleton />;
    case "cards":
      return <CardGridSkeleton />;
    case "stats":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      );
    case "dashboard":
      return <DashboardSkeleton />;
    case "spinner":
    default:
      return <SectionLoader />;
  }
};

/**
 * Renders exactly one of: skeleton loader, error state with retry,
 * empty state, or the actual content. Centralizes the pattern every
 * list page uses.
 */
export const PageState: React.FC<Props> = ({
  loading,
  error,
  empty,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  onRetry,
  children,
  className,
  loadingKind = "spinner",
}) => {
  if (loading) {
    return (
      <div className={className}>
        <SkeletonFor kind={loadingKind} />
      </div>
    );
  }
  if (error) {
    return (
      <div className={className}>
        <ErrorState message={error.message} onRetry={onRetry} />
      </div>
    );
  }
  if (empty) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
        />
      </div>
    );
  }
  return <div className={className}>{children}</div>;
};

export default PageState;
