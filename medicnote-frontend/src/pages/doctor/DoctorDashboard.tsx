import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import ScheduledEvents from "@/components/dashboard/ScheduledEvents";
import PrescriptionListPreview from "@/components/dashboard/PrescriptionListPreview";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import type { Appointment } from "@/types/prescription.types";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  // ✅ EMPTY STATE (READY FOR API)
  const appointments: Appointment[] = [];

  // ✅ DERIVED DATA (SAFE)
  const today = new Date().toISOString().split("T")[0];

  const totalPatientsServed = 0;
  const totalAppointmentsToday = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;
  const upcomingAppointments = appointments.filter(a => a.status === "scheduled").slice(0, 3);

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left + Center Column */}
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner name={user.name.split(" ")[0]} />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Patients Served"
              value={totalPatientsServed}
              subtitle="patients"
              change=""
              changeType="neutral"
              variant="offline"
            />
            <StatsCard
              label="Total Appointments Today"
              value={totalAppointmentsToday}
              subtitle="appointments"
              change=""
              changeType="neutral"
              variant="online"
            />
            <StatsCard
              label="Completed Appointments"
              value={completedAppointments}
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

        {/* Right Column */}
        <div className="space-y-6">
          <ProfileCard user={user} />
          <AppointmentCard appointments={appointments} highlightDate={today} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;