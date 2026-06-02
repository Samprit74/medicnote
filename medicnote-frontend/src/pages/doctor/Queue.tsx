import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, User } from "lucide-react";
import { appointmentService } from "@/services/appointmentService";

interface QueueItem {
  id: number;
  patientName: string;
  time: string;
  status: string;
}

const statusLabels: Record<string, string> = {
  PENDING: "Waiting",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-muted text-muted-foreground",
};

const Queue: React.FC = () => {
  const [appointments, setAppointments] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await appointmentService.getDoctorQueue();

      const mapped: QueueItem[] = res.data.map((a: any) => ({
        id: a.id,
        patientName: a.patientName,
        time: a.appointmentTime,
        status: a.status,
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error("Failed to fetch queue", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await appointmentService.updateStatus(id, "COMPLETED");
      fetchQueue();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">
          Patient Queue
        </h1>

        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {loading ? (
              <p className="p-5 text-sm text-muted-foreground">
                Loading...
              </p>
            ) : appointments.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                No patients in queue
              </p>
            ) : (
              appointments.map((q, i) => (
                <div
                  key={q.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50"
                >
                  {/* Queue number */}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                    {i + 1}
                  </span>

                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {q.patientName}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {q.time}
                  </div>

                  {/* Status */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[q.status] || statusColors.PENDING
                      }`}
                  >
                    {statusLabels[q.status] || "Waiting"}
                  </span>

                  {/* Action */}
                  {q.status === "PENDING" && (
                    <button
                      onClick={() => handleComplete(q.id)}
                      className="ml-2 rounded-md bg-primary px-3 py-1 text-xs text-white hover:opacity-90"
                    >
                      Complete
                    </button>
                  )}
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