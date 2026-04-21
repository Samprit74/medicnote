import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, User, Hash } from "lucide-react";
import api from "@/services/api";

interface AppointmentResponseDTO {
  id: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  queueNumber: number;
  status: string;
}

const statusLabels: Record<string, string> = {
  WAITING: "Waiting",
  IN_PROGRESS: "In Progress",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusColors: Record<string, string> = {
  IN_PROGRESS: "bg-success/10 text-success",
  WAITING: "bg-warning/10 text-warning",
  SCHEDULED: "bg-primary/10 text-primary",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const Queue: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/appointments/doctor/me/queue")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setAppointments([]);
          console.log("Queue response:", data);
        }
      })
      .catch((err) => {
        console.error("Queue error:", err);
        setError("Failed to load queue");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.put(`/api/appointments/${id}/status?status=${status}`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">Patient Queue</h1>

        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {isLoading ? (
              <p className="p-5 text-sm text-muted-foreground">Loading queue...</p>
            ) : error ? (
              <p className="p-5 text-sm text-destructive">{error}</p>
            ) : appointments.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No patients in queue</p>
            ) : (
              appointments.map((q) => (
                <div key={q.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50">

                  {/* Queue Number */}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                    {q.queueNumber}
                  </span>

                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{q.patientName}</p>
                    <p className="text-xs text-muted-foreground">{q.appointmentDate}</p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {q.appointmentTime}
                  </div>

                  {/* Status Update */}
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusUpdate(q.id, e.target.value)}
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="WAITING">Waiting</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  {/* Status Badge */}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[q.status] ?? "bg-muted text-muted-foreground"}`}>
                    {statusLabels[q.status] ?? q.status}
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