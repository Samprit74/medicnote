export const APP_NAME = "MedicNote";

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

export const DOCTOR_MENU: ReadonlyArray<MenuItem> = [
  { label: "Dashboard", path: "/doctor/dashboard", icon: "LayoutDashboard" },
  { label: "Patients", path: "/doctor/patients", icon: "Users" },
  { label: "Prescriptions", path: "/doctor/prescriptions", icon: "FileText" },
  { label: "Queue", path: "/doctor/queue", icon: "ClipboardList" },
  { label: "Profile", path: "/doctor/profile", icon: "UserCircle" },
];

export const PATIENT_MENU: ReadonlyArray<MenuItem> = [
  { label: "Dashboard", path: "/patient/dashboard", icon: "LayoutDashboard" },
  { label: "Find Doctor", path: "/patient/doctors", icon: "Stethoscope" },
  { label: "Prescriptions", path: "/patient/prescriptions", icon: "FileText" },
  { label: "Records", path: "/patient/records", icon: "FolderOpen" },
  { label: "Profile", path: "/patient/profile", icon: "UserCircle" },
];

export const ADMIN_MENU: ReadonlyArray<MenuItem> = [
  { label: "Admin", path: "/admin/dashboard", icon: "Shield" },
  { label: "Profile", path: "/admin/dashboard", icon: "UserCircle" },
];

export function menuForRole(role: "doctor" | "patient" | "admin"): ReadonlyArray<MenuItem> {
  if (role === "doctor") return DOCTOR_MENU;
  if (role === "admin") return ADMIN_MENU;
  return PATIENT_MENU;
}

export function dashboardPathForRole(role: "doctor" | "patient" | "admin"): string {
  if (role === "doctor") return "/doctor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/patient/dashboard";
}

export const APPOINTMENT_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"] as const;
export type AppointmentStatusLiteral = (typeof APPOINTMENT_STATUSES)[number];
