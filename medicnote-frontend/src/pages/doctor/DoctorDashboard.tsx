import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import ScheduledEvents from "@/components/dashboard/ScheduledEvents";
import PrescriptionListPreview from "@/components/dashboard/PrescriptionListPreview";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import type { Appointment } from "@/types/prescription.types";

interface NextAppointmentDTO {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface DoctorDashboardDTO {
  doctorId: number;
  doctorName: string;
  totalPatients: number;
  todayAppointments: number;
  completedAppointments: number;
  nextAppointments: NextAppointmentDTO[];
  totalAppointmentsInWindow: number;
  completedAppointmentsInWindow: number;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DoctorDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/dashboard/doctor/me")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  const upcomingAppointments: Appointment[] = (data?.nextAppointments ?? []).map((a) => ({
    id: String(a.id),
    patientName: a.patientName,
    date: a.date,
    time: a.time,
    title: a.type,
    type: "consultation",
    color: "#4f46e5",
    status: a.status as Appointment["status"],
  }));

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner name={user.name.split(" ")[0]} />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Patients Served"
              value={isLoading ? "..." : (data?.totalPatients ?? 0)}
              subtitle="patients"
              change=""
              changeType="neutral"
              variant="offline"
            />
            <StatsCard
              label="Total Appointments Today"
              value={isLoading ? "..." : (data?.todayAppointments ?? 0)}
              subtitle="appointments"
              change=""
              changeType="neutral"
              variant="online"
            />
            <StatsCard
              label="Completed Appointments"
              value={isLoading ? "..." : (data?.completedAppointments ?? 0)}
              subtitle="completed"
              change=""
              changeType="neutral"
              variant="lab"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ScheduledEvents />
            <PrescriptionListPreview appointments={upcomingAppointments} />
          </div>
        </div>

        <div className="space-y-6">
          <ProfileCard user={user} />
          <AppointmentCard appointments={upcomingAppointments} highlightDate={today} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;