import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import ScheduledEvents from "@/components/dashboard/ScheduledEvents";
import PrescriptionListPreview from "@/components/dashboard/PrescriptionListPreview";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/dashboardService";

interface NextAppointment {
  patientName: string;
  time: string;
}

interface DashboardData {
  totalPatients: number;
  todayAppointments: number;
  completedAppointments: number;
  nextAppointments: NextAppointment[];
  doctorName: string;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDoctorDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-sm text-red-500">{error}</p>
      </DashboardLayout>
    );
  }

  const todayDate = new Date();
  const today = todayDate.toISOString().split("T")[0];
  const isWeekend =
    todayDate.getDay() === 0 || todayDate.getDay() === 6;

  const completed = data?.completedAppointments ?? 0;
  const total = data?.todayAppointments ?? 0;
  const remaining = total - completed;

  const upcoming =
    data?.nextAppointments?.map((a, i) => ({
      id: i,
      patientName: a.patientName,
      time: a.time,
    })) || [];

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner
            name={(data?.doctorName || user.name).split(" ")[0]}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Patients Served"
              value={data?.totalPatients ?? 0}
              subtitle="patients"
              change=""
              changeType="neutral"
              variant="offline"
            />

            <StatsCard
              label="Total Appointments Today"
              value={total}
              subtitle="appointments"
              change=""
              changeType="neutral"
              variant="online"
            />

            <StatsCard
              label="Completed Appointments"
              value={completed}
              subtitle="completed"
              change=""
              changeType="neutral"
              variant="lab"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ScheduledEvents
              completed={completed}
              remaining={remaining}
              isWeekend={isWeekend}
            />

            <PrescriptionListPreview
              appointments={upcoming}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <ProfileCard
            user={{
              ...user,
              name: data?.doctorName || user.name,
            }}
          />

          <AppointmentCard
            appointments={[]}
            highlightDate={today}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;