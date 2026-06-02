import React from "react";
import type { AppointmentStatus } from "@/types/appointment.types";

const styles: Record<AppointmentStatus, string> = {
  PENDING: "bg-warning/15 text-warning border-warning/30",
  COMPLETED: "bg-success/15 text-success border-success/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
};

const labels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const StatusBadge: React.FC<{ status: AppointmentStatus | string }> = ({
  status,
}) => {
  const s = (status as AppointmentStatus) ?? "PENDING";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[s] ?? styles.PENDING
      }`}
    >
      {labels[s] ?? s}
    </span>
  );
};

export default StatusBadge;
