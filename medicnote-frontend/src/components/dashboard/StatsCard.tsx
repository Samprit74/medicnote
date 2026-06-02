import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Users, FlaskConical, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "offline" | "online" | "lab" | "sky" | "emerald" | "violet" | "amber";

interface StatsCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  variant?: Variant;
  icon?: LucideIcon;
}

const variantStyle: Record<Variant, { bg: string; ring: string; iconBg: string; iconColor: string; badge: string }> = {
  offline: {
    bg: "bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40",
    ring: "ring-sky-200/40 dark:ring-sky-800/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  },
  online: {
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
    ring: "ring-emerald-200/40 dark:ring-emerald-800/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  lab: {
    bg: "bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/40",
    ring: "ring-violet-200/40 dark:ring-violet-800/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40",
    ring: "ring-sky-200/40 dark:ring-sky-800/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40",
    ring: "ring-emerald-200/40 dark:ring-emerald-800/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40",
    ring: "ring-violet-200/40 dark:ring-violet-800/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
    ring: "ring-amber-200/40 dark:ring-amber-800/40",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
};

const defaultIcon: Record<Variant, LucideIcon> = {
  offline: Activity,
  online: Users,
  lab: FlaskConical,
  sky: Activity,
  emerald: Users,
  violet: FlaskConical,
  amber: Activity,
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  change,
  changeType,
  variant = "sky",
  icon,
}) => {
  const style = variantStyle[variant];
  const Icon = icon ?? defaultIcon[variant];
  const TrendIcon =
    changeType === "positive" ? TrendingUp : changeType === "negative" ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        style.bg,
        "ring-1",
        style.ring
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
        {change && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              changeType === "positive" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
              changeType === "negative" && "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
              changeType === "neutral" && style.badge
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", style.iconBg)}>
          <Icon className={cn("h-6 w-6", style.iconColor)} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <TrendIcon className="h-3 w-3" />
        <span>vs last week</span>
      </div>
    </div>
  );
};

export default StatsCard;
