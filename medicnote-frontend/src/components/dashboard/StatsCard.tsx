import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Users, FlaskConical } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  variant?: "offline" | "online" | "lab";
}

const iconMap = {
  offline: Activity,
  online: Users,
  lab: FlaskConical,
};

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  change,
  changeType,
  variant = "offline",
}) => {
  const Icon = iconMap[variant];
  const TrendIcon =
    changeType === "positive" ? TrendingUp : changeType === "negative" ? TrendingDown : Minus;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
        <button className="text-muted-foreground hover:text-foreground">•••</button>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs">
        <TrendIcon
          className={`h-3 w-3 ${
            changeType === "positive"
              ? "text-success"
              : changeType === "negative"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        />
        <span
          className={
            changeType === "positive"
              ? "text-success"
              : changeType === "negative"
              ? "text-destructive"
              : "text-muted-foreground"
          }
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
