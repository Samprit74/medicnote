import React, { useEffect, useState } from "react";
import { Bell, Calendar, Stethoscope, FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { dashboardService } from "@/services/dashboardService";
import { appointmentService } from "@/services/appointmentService";
import { formatDate, formatTime, formatRelative } from "@/lib/formatters";
import type { PatientDashboardDTO, UpcomingAppointmentDTO } from "@/types/dashboard.types";
import type { AppointmentDTO } from "@/types/appointment.types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  tint: string;
}

const tintFor = (tint: string) => {
  switch (tint) {
    case "emerald":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400";
    case "violet":
      return "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400";
    case "sky":
      return "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  // Patient: read dashboard
  const patientDash = useApi<PatientDashboardDTO>(
    () => dashboardService.getPatientDashboard(),
    []
  );
  // Doctor: read today's queue
  const doctorQueue = useApi<AppointmentDTO[]>(
    () => appointmentService.getDoctorQueue(),
    []
  );

  // Re-fetch when the popover opens so the count is fresh.
  useEffect(() => {
    if (!open) return;
    if (isPatient) patientDash.refetch();
    if (isDoctor) doctorQueue.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const items: NotificationItem[] = [];
  if (isPatient) {
    const upcoming = (patientDash.data?.upcomingAppointments ?? []).slice(0, 3);
    upcoming.forEach((u: UpcomingAppointmentDTO) => {
      items.push({
        id: `appt-${u.date}-${u.time}-${u.doctorName}`,
        icon: <Calendar className="h-4 w-4" />,
        title: `Visit with ${u.doctorName}`,
        subtitle: `${formatDate(u.date)} • ${formatTime(u.time)} • ${formatRelative(u.date)}`,
        badge: "Upcoming",
        tint: "emerald",
      });
    });
    const total = patientDash.data?.totalPrescriptions ?? 0;
    if (total > 0) {
      items.push({
        id: "rx-total",
        icon: <FileText className="h-4 w-4" />,
        title: `${total} prescription${total === 1 ? "" : "s"} on file`,
        subtitle: "View or download from the Prescriptions page.",
        tint: "violet",
      });
    }
  }
  if (isDoctor) {
    const pending = (doctorQueue.data ?? []).filter((a) => a.status === "PENDING");
    pending.slice(0, 3).forEach((a) => {
      items.push({
        id: `queue-${a.id}`,
        icon: <Stethoscope className="h-4 w-4" />,
        title: `${a.patientName} waiting`,
        subtitle: `${formatTime(a.appointmentTime)} • Queue #${a.queueNumber ?? "—"}`,
        badge: "Today",
        tint: "emerald",
      });
    });
  }

  const total = items.length;
  const isLoading = (isPatient && patientDash.loading) || (isDoctor && doctorQueue.loading);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {total > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {total > 9 ? "9+" : total}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {total > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {total} new
            </span>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : total === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              You're all caught up!
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      tintFor(n.tint)
                    )}
                  >
                    {n.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                      {n.badge && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {n.badge}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{n.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
          {total > 0 ? "Showing latest" : "No new notifications"}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
