import api from "./api";

export const prescriptionService = {
  create: (data: any) =>
    api.post("/api/prescriptions", data),

  createWithAppointment: (appointmentId: number, data?: any) =>
    api.post("/api/prescriptions/appointment", data, {
      params: { appointmentId },
    }),

  createWithEmail: (data: any) =>
    api.post("/api/prescriptions/email", data),

  getByPatient: (patientId: number, page = 0, size = 7) =>
    api.get(`/api/prescriptions/doctor/me/patient/${patientId}`, {
      params: { page, size },
    }),

  getByDate: (date: string, page = 0, size = 7) =>
    api.get("/api/prescriptions/doctor/me/date", {
      params: { date, page, size },
    }),

  getById: (id: number) =>
    api.get(`/api/prescriptions/${id}`),

  download: (id: number) =>
    api.get(`/api/prescriptions/${id}/download`, {
      responseType: "blob",
    }),
};