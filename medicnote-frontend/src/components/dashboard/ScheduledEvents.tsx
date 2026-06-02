import React from "react";

interface Props {
  completed: number;
  remaining: number;
  isWeekend: boolean;
}

const ScheduledEvents: React.FC<Props> = ({
  completed,
  remaining,
  isWeekend,
}) => {
  const total = completed + remaining || 1;

  const completedPercent = Math.round((completed / total) * 100);
  const remainingPercent = 100 - completedPercent;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          MY SCHEDULED EVENTS
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs text-white ${
            isWeekend ? "bg-red-500" : "bg-primary"
          }`}
        >
          Today
        </span>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3.5"
              strokeDasharray={`${completedPercent} ${remainingPercent}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">
              {completedPercent}
            </span>
            <span className="text-[10px] text-muted-foreground">% DONE</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {completed}
            </span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-chart-orange">
              {remaining}
            </span>
            <span className="text-xs text-muted-foreground">Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledEvents;