import api from "./api";

export const patientService = {
  /**
   * 🔹 Get logged-in patient profile
   */
  getProfile: () => api.get("/api/patients/me"),

  /**
   * 🔹 Update patient profile
   */
  updateProfile: (data: {
    name: string;
    email: string;
    age: number;
    phone: string;
    gender: string;
    address: string;
  }) => api.put("/api/patients/me", data),

  /**
   * 🔹 Doctor: Get patients (paginated)
   */
  getDoctorPatients: (page = 0, size = 7) =>
    api.get("/api/patients/doctor/me", {
      params: { page, size },
    }),

  /**
   * 🔹 Doctor: Search patients (paginated)
   */
  searchPatients: (keyword: string, page = 0, size = 7) =>
    api.get("/api/patients/doctor/me/search", {
      params: { keyword, page, size },
    }),
};