/**
 * Centralized URL constants.
 *
 * Single place to change API paths. Services use these instead of hardcoding strings.
 * The .env base URL is `http://localhost:8080` (no /api), so each constant below
 * includes its own prefix.
 */
export const ENDPOINTS = {
  // Auth (no /api)
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  // Doctor
  doctors: {
    base: "/api/doctors",
    me: "/api/doctors/me",
    byId: (id: number | string) => `/api/doctors/${id}`,
    search: "/api/doctors/search",
    searchPaginated: "/api/doctors/search-paginated",
  },

  // Patient
  patients: {
    base: "/api/patients",
    me: "/api/patients/me",
    byId: (id: number | string) => `/api/patients/${id}`,
    doctorMe: "/api/patients/doctor/me",
    doctorMeSearch: "/api/patients/doctor/me/search",
    doctorMeToday: "/api/patients/doctor/me/today",
    doctorMeWeekly: "/api/patients/doctor/me/weekly",
  },

  // Appointment
  appointments: {
    base: "/api/appointments",
    doctorMeQueue: "/api/appointments/doctor/me/queue",
    doctorMe: "/api/appointments/doctor/me",
    patientMe: "/api/appointments/patient/me",
    patientMeHistory: "/api/appointments/patient/me/history",
    status: (id: number | string) => `/api/appointments/${id}/status`,
    cancel: (id: number | string) => `/api/appointments/${id}/cancel`,
    doctorAvailability: (doctorId: number | string) =>
      `/api/appointments/doctor/${doctorId}/availability`,
  },

  // Prescription
  prescriptions: {
    base: "/api/prescriptions",
    appointment: "/api/prescriptions/appointment",
    email: "/api/prescriptions/email",
    patientMe: "/api/prescriptions/patient/me",
    patientMeDate: "/api/prescriptions/patient/me/date",
    patientMeDoctor: "/api/prescriptions/patient/me/doctor",
    patientMeRange: "/api/prescriptions/patient/me/range",
    doctorMePatient: (patientId: number | string) =>
      `/api/prescriptions/doctor/me/patient/${patientId}`,
    doctorMeDate: "/api/prescriptions/doctor/me/date",
    byId: (id: number | string) => `/api/prescriptions/${id}`,
    download: (id: number | string) => `/api/prescriptions/${id}/download`,
  },

  // Dashboard
  dashboard: {
    doctorMe: "/api/dashboard/doctor/me",
    patientMe: "/api/dashboard/patient/me",
  },
} as const;
