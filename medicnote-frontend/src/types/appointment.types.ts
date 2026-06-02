import type { Id } from "./api.types";

export type AppointmentStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface AppointmentDTO {
  id: Id;
  doctorId: Id;
  doctorName: string;
  patientId: Id;
  patientName: string;
  appointmentDate: string; // LocalDate → "YYYY-MM-DD"
  appointmentTime: string; // LocalTime → "HH:mm:ss"
  queueNumber: number;
  status: AppointmentStatus;
}

export interface AppointmentRequest {
  doctorId: number;
  appointmentDate: string; // YYYY-MM-DD
}

export interface AvailabilitySlot {
  date: string;
  availableSlots: number;
  doctorName: string;
}
