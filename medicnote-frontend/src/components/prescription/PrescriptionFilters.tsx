import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/common/DateRangePicker";

export type PrescriptionFilter =
  | { kind: "all" }
  | { kind: "date"; date: string }
  | { kind: "doctor"; doctorName: string }
  | { kind: "range"; start: string; end: string };

interface Props {
  onChange: (f: PrescriptionFilter) => void;
}

export const PrescriptionFilters: React.FC<Props> = ({ onChange }) => {
  const [mode, setMode] = useState<"all" | "date" | "doctor" | "range">("all");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });

  const apply = () => {
    if (mode === "all") onChange({ kind: "all" });
    else if (mode === "date" && date) onChange({ kind: "date", date });
    else if (mode === "doctor" && doctor) onChange({ kind: "doctor", doctorName: doctor });
    else if (mode === "range" && range.start && range.end)
      onChange({ kind: "range", start: range.start, end: range.end });
  };

  const reset = () => {
    setMode("all");
    setDate("");
    setDoctor("");
    setRange({ start: "", end: "" });
    onChange({ kind: "all" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        Filter
      </div>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as typeof mode)}
        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
      >
        <option value="all">All</option>
        <option value="date">By date</option>
        <option value="doctor">By doctor</option>
        <option value="range">By range</option>
      </select>

      {mode === "date" && (
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 w-auto" />
      )}
      {mode === "doctor" && (
        <Input
          placeholder="Doctor name"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="h-9 w-48"
        />
      )}
      {mode === "range" && (
        <DateRangePicker start={range.start} end={range.end} onChange={setRange} />
      )}

      <Button size="sm" onClick={apply}>
        Apply
      </Button>
      <Button size="sm" variant="ghost" onClick={reset}>
        <X className="mr-1 h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
};

export default PrescriptionFilters;
