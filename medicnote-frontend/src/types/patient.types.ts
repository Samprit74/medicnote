import type { Id } from "./api.types";

export interface PatientDTO {
  id: Id;
  name: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
  address: string;
}

export interface PatientRequest {
  name: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
  address: string;
}
