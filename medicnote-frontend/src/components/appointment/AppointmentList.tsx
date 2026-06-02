import React from "react";
import type { AppointmentDTO } from "@/types/appointment.types";
import { AppointmentListItem } from "./AppointmentListItem";

interface Props {
  appointments: AppointmentDTO[];
  emptyLabel?: string;
  showDoctor?: boolean;
  onComplete?: (id: AppointmentDTO["id"]) => void;
  onCancel?: (id: AppointmentDTO["id"]) => void;
}

export const AppointmentList: React.FC<Props> = ({
  appointments,
  emptyLabel = "No appointments",
  showDoctor,
  onComplete,
  onCancel,
}) => (
  <div className="rounded-xl border border-border bg-card">
    <div className="divide-y divide-border">
      {appointments.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        appointments.map((a) => (
          <AppointmentListItem
            key={String(a.id)}
            appointment={a}
            showDoctor={showDoctor}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        ))
      )}
    </div>
  </div>
);

export default AppointmentList;
