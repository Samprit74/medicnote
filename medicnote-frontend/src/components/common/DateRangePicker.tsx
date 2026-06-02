import React from "react";

interface Props {
  start: string;
  end: string;
  onChange: (next: { start: string; end: string }) => void;
  className?: string;
}

export const DateRangePicker: React.FC<Props> = ({ start, end, onChange, className }) => (
  <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
    <input
      type="date"
      value={start}
      onChange={(e) => onChange({ start: e.target.value, end })}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
    <span className="text-xs text-muted-foreground">to</span>
    <input
      type="date"
      value={end}
      onChange={(e) => onChange({ start, end: e.target.value })}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
);

export default DateRangePicker;
