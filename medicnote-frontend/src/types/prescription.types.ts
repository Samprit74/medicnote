import type { Id } from "./api.types";

export interface PrescriptionItemDTO {
  id?: Id;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionDTO {
  id: Id;
  date: string; // YYYY-MM-DD
  diagnosis?: string;
  notes?: string;
  doctorId: Id;
  doctorName: string;
  patientId: Id;
  patientName: string;
  items: PrescriptionItemDTO[];
}

export interface PrescriptionRequest {
  appointmentId: number;
  diagnosis?: string;
  notes?: string;
  items: PrescriptionItemDTO[];
}

export interface PrescriptionByEmailRequest {
  appointmentId: number;
  patientEmail: string;
  diagnosis?: string;
  notes?: string;
  items: PrescriptionItemDTO[];
}
