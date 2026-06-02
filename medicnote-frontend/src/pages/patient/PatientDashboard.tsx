import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, RefreshCw, Stethoscope, Pill, FileText, FolderOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { dashboardService } from "@/services/dashboardService";
import { appointmentService } from "@/services/appointmentService";
import { BookAppointmentDialog } from "@/components/appointment/BookAppointmentDialog";
import { Float } from "@/components/common/Float";
import { EmptyIllustration } from "@/components/common/EmptyIllustration";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import { formatDate, formatTime, formatRelative, todayIso } from "@/lib/formatters";
import type { PatientDashboardDTO, UpcomingAppointmentDTO } from "@/types/dashboard.types";
import type { AppointmentDTO } from "@/types/appointment.types";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useApi<PatientDashboardDTO>(
    () => dashboardService.getPatientDashboard(),
    []
  );
  const [bookOpen, setBookOpen] = useState(false);

  if (!user) return null;

  if (loading && !data) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const upcomingDtos = data?.upcomingAppointments ?? [];
  const nextAppt = upcomingDtos[0];
  const highlightDate = nextAppt?.date ?? todayIso();

  const upcoming: AppointmentDTO[] = upcomingDtos.map((u, i) =>
    mapUpcomingToAppointment(u, i)
  );

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WelcomeBanner name={(data?.patientName || user.name).split(" ")[0]} />

          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard
              label="Total Prescriptions"
              value={data?.totalPrescriptions ?? 0}
              subtitle="prescriptions"
              change={data && data.totalPrescriptions > 0 ? `${data.totalPrescriptions}` : "—"}
              changeType="positive"
              variant="violet"
              icon={Pill}
            />
            <StatsCard
              label="Total Appointments"
              value={data?.totalAppointments ?? 0}
              subtitle="appointments"
              change={data && data.totalAppointments > 0 ? `${data.totalAppointments}` : "—"}
              changeType="neutral"
              variant="emerald"
              icon={Calendar}
            />
            <StatsCard
              label="Upcoming"
              value={upcomingDtos.length}
              subtitle="scheduled"
              change={nextAppt ? `next ${formatRelative(nextAppt.date)}` : "none"}
              changeType="positive"
              variant="sky"
              icon={Stethoscope}
            />
          </div>

          <QuickActions
            actions={[
              {
                label: "Book appointment",
                to: "#",
                icon: "Calendar",
                tint: "emerald",
                description: "Find a doctor and pick a date",
                onClick: () => setBookOpen(true),
              },
              { label: "My prescriptions", to: "/patient/prescriptions", icon: "FileText", tint: "violet", description: "View, download, and manage" },
              { label: "Visit records", to: "/patient/records", icon: "FolderOpen", tint: "amber", description: "Past appointment history" },
            ]}
          />

          <UpcomingAppointments
            items={upcomingDtos}
            loading={loading}
            error={error?.message ?? null}
            onRetry={refetch}
          />
        </div>

        <div className="space-y-6">
          <ProfileCard user={user} />
          <NextVisitCard appointment={nextAppt} onBook={() => setBookOpen(true)} />
          <AppointmentCard appointments={upcoming} highlightDate={highlightDate} />
        </div>
      </div>

      <BookAppointmentDialog open={bookOpen} onOpenChange={setBookOpen} onBooked={refetch} />
    </DashboardLayout>
  );
};

function mapUpcomingToAppointment(u: UpcomingAppointmentDTO, i: number): AppointmentDTO {
  return {
    id: i,
    doctorId: 0,
    doctorName: u.doctorName,
    patientId: 0,
    patientName: "",
    appointmentDate: u.date,
    appointmentTime: u.time,
    queueNumber: 0,
    status: "PENDING",
  };
}

const NextVisitCard: React.FC<{
  appointment: UpcomingAppointmentDTO | undefined;
  onBook: () => void;
}> = ({ appointment, onBook }) => (
  <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 ring-1 ring-emerald-200/40 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40 dark:ring-emerald-800/40">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base">
        <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        Next visit
      </CardTitle>
    </CardHeader>
    <CardContent>
      {appointment ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{appointment.doctorName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(appointment.date)}</span>
            <span>•</span>
            <span>{formatTime(appointment.time)}</span>
          </div>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {formatRelative(appointment.date)}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No upcoming visit scheduled.</p>
          <Button size="sm" onClick={onBook} className="mt-1">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Book now
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

const UpcomingAppointments: React.FC<{
  items: UpcomingAppointmentDTO[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}> = ({ items, loading, error, onRetry }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-base">Upcoming appointments</CardTitle>
      <Button variant="ghost" size="sm" onClick={onRetry} disabled={loading}>
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </CardHeader>
    <CardContent>
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      {loading && items.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <EmptyIllustration kind="queue" className="h-16 w-16" />
          <p className="text-sm font-medium text-foreground">No upcoming appointments</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Tap the card above to book your next visit.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((u, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Float speed={i % 2 === 0 ? "slower" : "drift"} className="rounded-full">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </Float>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(u.date)}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-foreground">{formatTime(u.time)}</span>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default PatientDashboard;
