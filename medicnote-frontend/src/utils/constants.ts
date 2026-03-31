export const APP_NAME = "MedicNote";

export const DOCTOR_MENU = [
  { label: "Dashboard", path: "/doctor/dashboard", icon: "LayoutDashboard" },
  { label: "Patients", path: "/doctor/patients", icon: "Users" },
  { label: "Prescriptions", path: "/doctor/prescriptions", icon: "FileText" },
  { label: "Queue", path: "/doctor/queue", icon: "ClipboardList" },
  { label: "Profile", path: "/doctor/profile", icon: "UserCircle" },
] as const;

export const PATIENT_MENU = [
  { label: "Dashboard", path: "/patient/dashboard", icon: "LayoutDashboard" },
  { label: "Prescriptions", path: "/patient/prescriptions", icon: "FileText" },
  { label: "Records", path: "/patient/records", icon: "FolderOpen" },
  { label: "Profile", path: "/patient/profile", icon: "UserCircle" },
] as const;
