export type UserRole = "doctor" | "patient" | "admin";

export interface User {
  id: number; // backend sends Long → number (not string)
  name: string;
  email: string;
  role: UserRole;

  // optional UI fields (not always from backend)
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