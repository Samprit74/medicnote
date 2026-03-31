import api from "./api";

export const patientService = {
  getAll: () => api.get("/patients"),
  getById: (id: string) => api.get(`/patients/${id}`),
  getRecords: (id: string) => api.get(`/patients/${id}/records`),
};
