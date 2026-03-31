import React from "react";

const ScheduledEvents: React.FC = () => {
  const events = [
    { label: "Consultations", value: 25, color: "text-primary" },
    { label: "Laboratory analyzes", value: 10, color: "text-chart-pink" },
    { label: "Meetings", value: 3, color: "text-chart-orange" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">MY SCHEDULED EVENTS</h3>
        <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
          Today
        </span>
      </div>

      <div className="mt-6 flex items-center gap-6">
        {/* Donut chart simulation */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3.5"
            />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3.5"
              strokeDasharray="66 34"
              strokeLinecap="round"
            />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="hsl(var(--chart-pink))"
              strokeWidth="3.5"
              strokeDasharray="26 74"
              strokeDashoffset="-66"
              strokeLinecap="round"
            />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="hsl(var(--chart-orange))"
              strokeWidth="3.5"
              strokeDasharray="8 92"
              strokeDashoffset="-92"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">95</span>
            <span className="text-[10px] text-muted-foreground">% BUSYNESS</span>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.label} className="flex items-center gap-2">
              <span className={`text-xl font-bold ${e.color}`}>{e.value}</span>
              <span className="text-xs text-muted-foreground">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduledEvents;
