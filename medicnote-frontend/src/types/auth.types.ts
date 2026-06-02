export type BackendRole = "ROLE_ADMIN" | "ROLE_DOCTOR" | "ROLE_PATIENT";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: BackendRole;
  // Doctor-only:
  specialization?: string;
  experience?: number;
}
