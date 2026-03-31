import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, User } from "lucide-react";
import type { Appointment } from "@/types/prescription.types";

const statusLabels: Record<string, string> = {
  "in-progress": "In Progress",
  waiting: "Waiting",
  scheduled: "Scheduled",
  completed: "Completed",
};

const statusColors: Record<string, string> = {
  "in-progress": "bg-success/10 text-success",
  waiting: "bg-warning/10 text-warning",
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
};

const Queue: React.FC = () => {
  // ✅ READY FOR API
  const appointments: Appointment[] = [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">Patient Queue</h1>

        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {appointments.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                No patients in queue
              </p>
            ) : (
              appointments.map((q, i) => (
                <div
                  key={q.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                    {i + 1}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {q.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {q.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {q.time}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[q.status || "scheduled"]
                      }`}
                  >
                    {statusLabels[q.status || "scheduled"]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Queue;