import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import ScheduledEvents from "@/components/dashboard/ScheduledEvents";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { dashboardService } from "@/services/dashboardService";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { todayIso, formatTime } from "@/lib/formatters";
import type { DoctorDashboardDTO, NextAppointmentDTO } from "@/types/dashboard.types";
import type { AppointmentDTO } from "@/types/appointment.types";

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useApi<DoctorDashboardDTO>(
    () => dashboardService.getDoctorDashboard(),
    []
  );

  if (!user) return null;

  if (loading && !data) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const today = todayIso();
  const completed = data?.completedAppointments ?? 0;
  const total = data?.todayAppointments ?? 0;
  const remaining = Math.max(0, total - completed);
  const todayDate = new Date();
  const isWeekend = todayDate.getDay() === 0 || todayDate.getDay() === 6;

  // Map dashboard next-appointments to the shape AppointmentCard / PrescriptionListPreview expect.
  const nextAppointments: NextAppointmentDTO[] = data?.nextAppointments ?? [];
  const upcomingItems = nextAppointments.map((a, i) => ({
    id: i,
    patientName: a.patientName,
    time: formatTime(a.time),
  }));

  // AppointmentCard expects AppointmentDTO[]; render empty since today's list is in Queue.
  const appointmentsForCard: AppointmentDTO[] = [];

  // Profile card uses `name` (specialization from DTO).
  const profileUser = {
    ...user,
    name: data?.doctorName || user.name,
    specialization: data?.doctorName ? undefined : user.specialization,
  };

  return (
    <DashboardLayout>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="sr-only">Doctor dashboard</h1>
        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner name={(data?.doctorName || user.name).split(" ")[0]} />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Patients Served"
              value={data?.totalPatients ?? 0}
              subtitle="patients"
              change="+12%"
              changeType="positive"
              variant="sky"
            />
            <StatsCard
              label="Appointments Today"
              value={total}
              subtitle="appointments"
              change={total > 0 ? `${total} new` : "0 new"}
              changeType="neutral"
              variant="emerald"
            />
            <StatsCard
              label="Completed Today"
              value={completed}
              subtitle="completed"
              change={`${Math.round((completed / Math.max(1, total)) * 100)}%`}
              changeType="positive"
              variant="violet"
            />
          </div>

          <QuickActions
            actions={[
              { label: "Today's queue", to: "/doctor/queue", icon: "ClipboardList", tint: "emerald" },
              { label: "New prescription", to: "/doctor/prescriptions", icon: "FileText", tint: "violet" },
              { label: "Search patients", to: "/doctor/patients", icon: "Users", tint: "sky" },
            ]}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <ScheduledEvents
              completed={completed}
              remaining={remaining}
              isWeekend={isWeekend}
            />
            <UpcomingAppointmentsCard items={upcomingItems} loading={loading} error={error?.message ?? null} onRetry={refetch} />
          </div>
        </div>

        <div className="space-y-6">
          <ProfileCard user={profileUser} />
          <AppointmentCard appointments={appointmentsForCard} highlightDate={today} />
        </div>
      </div>
    </DashboardLayout>
  );
};

interface UpcomingProps {
  items: { id: number; patientName: string; time: string }[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const UpcomingAppointmentsCard: React.FC<UpcomingProps> = ({ items, loading, error, onRetry }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">UPCOMING APPOINTMENTS</h3>
        <span className="text-xs font-medium text-primary">Today</span>
      </div>
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : error ? (
          <div>
            <p className="text-xs text-destructive">{error}</p>
            <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming appointments</p>
        ) : (
          items.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{apt.patientName}</span>
              <span className="text-muted-foreground">{apt.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
