import api from "./api";

/**
 * Base Register Type (common fields)
 */
type BaseRegister = {
  name: string;
  email: string;
  password: string;
  role: "ROLE_PATIENT" | "ROLE_DOCTOR" | "ROLE_ADMIN";
};

/**
 * Doctor Extra Fields
 */
type DoctorExtra = {
  specialization?: string;
  experience?: number;
};

export type RegisterRequest = BaseRegister & DoctorExtra;

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", {
      email,
      password,
    }),

  register: (data: RegisterRequest) =>
    api.post("/auth/register", data),
};