import React, { useEffect, useState } from "react";
import { FileText, Clock } from "lucide-react";
import api from "@/services/api";

interface AppointmentResponseDTO {
  id: number;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600",
  CANCELLED: "bg-destructive/10 text-destructive",
  SCHEDULED: "bg-primary/10 text-primary",
  WAITING: "bg-warning/10 text-warning",
  IN_PROGRESS: "bg-success/10 text-success",
};

const RecordsList: React.FC = () => {
  const [records, setRecords] = useState<AppointmentResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/appointments/patient/me/history")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setRecords(data);
        } else if (data?.content && Array.isArray(data.content)) {
          setRecords(data.content);
        } else {
          setRecords([]);
          console.log("Records response:", data);
        }
      })
      .catch((err) => {
        console.error("Records error:", err);
        setError("Failed to load records");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading records...</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="divide-y divide-border">
        {records.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No records found</p>
        ) : (
          records.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
                <FileText className="h-4 w-4 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Dr. {r.doctorName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {r.appointmentDate} — {r.appointmentTime}
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] ?? "bg-muted text-muted-foreground"}`}>
                {r.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecordsList;