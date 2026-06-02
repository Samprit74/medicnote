import type { Id } from "./api.types";

export interface NextAppointmentDTO {
  patientName: string;
  time: string; // LocalTime
}

export interface UpcomingAppointmentDTO {
  doctorName: string;
  date: string;
  time: string;
}

export interface DoctorDashboardDTO {
  doctorId: Id;
  doctorName: string;
  totalPatients: number;
  todayAppointments: number;
  completedAppointments: number;
  nextAppointments: NextAppointmentDTO[];
  totalAppointmentsInWindow: number;
  completedAppointmentsInWindow: number;
}

export interface PatientDashboardDTO {
  patientId: Id;
  patientName: string;
  totalAppointments: number;
  totalPrescriptions: number;
  upcomingAppointments: UpcomingAppointmentDTO[];
}
