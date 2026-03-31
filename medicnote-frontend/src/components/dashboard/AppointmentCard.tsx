import React from "react";
import type { Appointment } from "@/types/prescription.types";

interface AppointmentCardProps {
  appointments: Appointment[];
  highlightDate?: string;
}

const colorMap: Record<string, string> = {
  blue: "bg-primary",
  green: "bg-success",
  orange: "bg-warning",
  red: "bg-destructive",
  purple: "bg-chart-purple",
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointments, highlightDate }) => {
  const today = new Date();
  const targetDate = highlightDate || today.toISOString().split("T")[0];
  const target = new Date(targetDate);

  const highlightDay = target.getDate();
  const monthName = target.toLocaleString("default", { month: "long" });
  const displayDate = `${monthName.toUpperCase()}, ${highlightDay}`;

  // Week row
  const startDay = highlightDay - target.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => startDay + i);

  // Filter today’s appointments
  const todaysAppointments = appointments.filter(a => a.date === targetDate);

  const totalClients = todaysAppointments.length;
  const remainingClients = todaysAppointments.filter(a => a.status !== "completed").length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">MY CALENDAR</h3>
        <span className="rounded-lg bg-primary px-3 py-1 text-xs text-primary-foreground">
          {monthName}
        </span>
      </div>

      {/* Week */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="text-muted-foreground">{d}</span>
        ))}
        {weekDays.map((n) => (
          <span
            key={n}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm mx-auto ${n === highlightDay
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground"
              }`}
          >
            {n > 0 ? n : ""}
          </span>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between text-sm border-t border-border pt-3">
        {todaysAppointments.length > 0 && todaysAppointments[0].doctorName ? (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="text-sm font-medium text-foreground">
                {todaysAppointments[0].doctorName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium text-foreground">
                {todaysAppointments[0].time}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Total Clients Today</p>
              <p className="text-lg font-bold text-foreground">{totalClients}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-lg font-bold text-foreground">{remainingClients}</p>
            </div>
          </>
        )}
      </div>

      {/* Events */}
      <div className="mt-4">
        <p className="mb-3 text-xs font-semibold text-muted-foreground">
          {displayDate}
        </p>

        {todaysAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments</p>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto scrollbar-thin">
            {todaysAppointments.map((apt) => (
              <div key={apt.id} className="flex items-start gap-3">
                <span className="mt-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  {apt.time}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${colorMap[apt.color] || "bg-primary"
                      }`}
                  />
                  <span className="text-sm text-foreground">
                    {apt.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;