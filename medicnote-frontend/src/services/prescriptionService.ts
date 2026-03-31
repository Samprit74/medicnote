import api from "./api";

export const prescriptionService = {
  getAll: () => api.get("/prescriptions"),
  getById: (id: string) => api.get(`/prescriptions/${id}`),
  create: (data: unknown) => api.post("/prescriptions", data),
  update: (id: string, data: unknown) => api.put(`/prescriptions/${id}`, data),
  delete: (id: string) => api.delete(`/prescriptions/${id}`),
};
