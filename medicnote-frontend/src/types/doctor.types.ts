import type { Id } from "./api.types";

export interface DoctorDTO {
  id: Id;
  name: string;
  email: string;
  specialization: string;
  experience: number;
}

export interface DoctorRequest {
  name: string;
  email: string;
  specialization: string;
  experience: number;
}
