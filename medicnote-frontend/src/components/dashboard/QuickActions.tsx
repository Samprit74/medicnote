import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  UserCircle,
  FolderOpen,
  Calendar,
  Stethoscope,
  Pill,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  UserCircle,
  FolderOpen,
  Calendar,
  Stethoscope,
  Pill,
};

export type ActionTint = "sky" | "emerald" | "violet" | "amber" | "rose";

export interface QuickActionItem {
  label: string;
  to: string;
  icon: string;
  tint?: ActionTint;
  description?: string;
  /** If set, the action triggers this callback instead of navigating. */
  onClick?: () => void;
}

interface Props {
  actions: QuickActionItem[];
  className?: string;
}

const tintStyle: Record<
  ActionTint,
  { bg: string; ring: string; iconBg: string; iconColor: string; hover: string }
> = {
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40",
    ring: "ring-sky-200/40 dark:ring-sky-800/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    hover: "hover:border-sky-300 dark:hover:border-sky-700",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
    ring: "ring-emerald-200/40 dark:ring-emerald-800/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/40",
    ring: "ring-violet-200/40 dark:ring-violet-800/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    hover: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
    ring: "ring-amber-200/40 dark:ring-amber-800/40",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    hover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40",
    ring: "ring-rose-200/40 dark:ring-rose-800/40",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    hover: "hover:border-rose-300 dark:hover:border-rose-700",
  },
};

/**
 * Row of large, colored action cards used near the top of dashboards.
 * Designed to give the user a clear next move without scrolling.
 */
export const QuickActions: React.FC<Props> = ({ actions, className }) => {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {actions.map((a) => {
        const Icon = iconMap[a.icon] || LayoutDashboard;
        const tint = tintStyle[a.tint ?? "sky"];
        const className = cn(
          "group flex items-center gap-4 rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          tint.bg,
          "ring-1",
          tint.ring,
          tint.hover
        );
        const inner = (
          <>
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                tint.iconBg
              )}
            >
              <Icon className={cn("h-6 w-6", tint.iconColor)} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{a.label}</p>
              {a.description && (
                <p className="truncate text-xs text-muted-foreground">{a.description}</p>
              )}
            </div>
          </>
        );
        if (a.onClick) {
          return (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={cn(className, "text-left")}
            >
              {inner}
            </button>
          );
        }
        return (
          <Link key={a.to} to={a.to} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
