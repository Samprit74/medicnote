import React from "react";
import { Clock, User } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatTime } from "@/lib/formatters";
import type { AppointmentDTO } from "@/types/appointment.types";

interface Props {
  appointment: AppointmentDTO;
  onComplete?: (id: AppointmentDTO["id"]) => void;
  onCancel?: (id: AppointmentDTO["id"]) => void;
  showDoctor?: boolean;
}

export const AppointmentListItem: React.FC<Props> = ({
  appointment,
  onComplete,
  onCancel,
  showDoctor = false,
}) => {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          {showDoctor ? appointment.doctorName : appointment.patientName}
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(appointment.appointmentTime)}
          </span>
          <span>{formatDate(appointment.appointmentDate)}</span>
          {typeof appointment.queueNumber === "number" && (
            <span className="rounded bg-muted px-1.5 py-0.5">
              Q#{appointment.queueNumber}
            </span>
          )}
        </div>
      </div>

      <StatusBadge status={appointment.status} />

      {onComplete && appointment.status === "PENDING" && (
        <button
          onClick={() => onComplete(appointment.id)}
          className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          Complete
        </button>
      )}
      {onCancel && appointment.status === "PENDING" && (
        <button
          onClick={() => onCancel(appointment.id)}
          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default AppointmentListItem;
