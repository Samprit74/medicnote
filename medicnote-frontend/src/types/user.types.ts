export type UserRole = "doctor" | "patient" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialization?: string;
  location?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  workingHours?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
