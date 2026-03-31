import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import type { Appointment } from "@/types/prescription.types";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const appointments: Appointment[] = [];

  const totalPrescriptions = 0;
  const totalAppointments = appointments.length;
  const nextAppointment = appointments.find(a => a.status === "scheduled");

  const nextVisitDate = nextAppointment?.date || "N/A";

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner name={user.name.split(" ")[0]} />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Prescriptions"
              value={totalPrescriptions}
              subtitle="prescriptions"
              change=""
              changeType="neutral"
              variant="offline"
            />

            <StatsCard
              label="Total Appointments"
              value={totalAppointments}
              subtitle="appointments"
              change=""
              changeType="neutral"
              variant="online"
            />

            <StatsCard
              label="Upcoming Visit"
              value={nextVisitDate}
              subtitle="next appointment"
              change=""
              changeType="neutral"
              variant="lab"
            />
          </div>
        </div>

        <div className="space-y-6">
          <ProfileCard user={user} />
          <AppointmentCard
            appointments={appointments}
            highlightDate={nextVisitDate !== "N/A" ? nextVisitDate : undefined}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;