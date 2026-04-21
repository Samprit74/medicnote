import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import type { Appointment } from "@/types/prescription.types";
import BookAppointment from "@/pages/patient/BookAppointment";

interface UpcomingAppointmentDTO {
  doctorName: string;
  date: string;
  time: string;
}

interface PatientDashboardDTO {
  patientId: number;
  patientName: string;
  totalAppointments: number;
  totalPrescriptions: number;
  upcomingAppointments: UpcomingAppointmentDTO[];
}

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PatientDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/dashboard/patient/me")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!user) return null;

  const upcomingAppointments: Appointment[] = (data?.upcomingAppointments ?? []).map((a, i) => ({
    id: String(i),
    doctorName: a.doctorName,
    date: a.date,
    time: a.time,
    title: a.doctorName,
    type: "consultation",
    color: "#4f46e5",
    status: "scheduled",
  }));

  const nextVisitDate = upcomingAppointments[0]?.date ?? "N/A";

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
              label="Total Prescriptions"
              value={isLoading ? "..." : (data?.totalPrescriptions ?? 0)}
              subtitle="prescriptions"
              change=""
              changeType="neutral"
              variant="offline"
            />
            <StatsCard
              label="Total Appointments"
              value={isLoading ? "..." : (data?.totalAppointments ?? 0)}
              subtitle="appointments"
              change=""
              changeType="neutral"
              variant="online"
            />
            <StatsCard
              label="Upcoming Visit"
              value={isLoading ? "..." : nextVisitDate}
              subtitle="next appointment"
              change=""
              changeType="neutral"
              variant="lab"
            />
          </div>

          {/* 👇 Book Appointment inga add pannittom */}
          <BookAppointment />

        </div>

        <div className="space-y-6">
          <ProfileCard user={user} />
          <AppointmentCard
            appointments={upcomingAppointments}
            highlightDate={nextVisitDate !== "N/A" ? nextVisitDate : undefined}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;