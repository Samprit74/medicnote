import React from "react";
import type { Appointment } from "@/types/prescription.types";

interface PrescriptionListPreviewProps {
  appointments: Appointment[];
}

const PrescriptionListPreview: React.FC<PrescriptionListPreviewProps> = ({ appointments }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">UPCOMING APPOINTMENTS</h3>
        <span className="text-xs text-primary font-medium">Today</span>
      </div>

      <div className="mt-4 space-y-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming appointments</p>
        ) : (
          appointments.slice(0, 3).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{apt.patientName || apt.title}</span>
              <span className="text-muted-foreground">{apt.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrescriptionListPreview;