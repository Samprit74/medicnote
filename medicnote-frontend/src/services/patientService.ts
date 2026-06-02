import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { PatientDTO, PatientRequest } from "@/types/patient.types";
import type { Id, PageResponse } from "@/types/api.types";

export const patientService = {
  /** PATIENT — own profile */
  getProfile: () =>
    axiosClient.get<PatientDTO>(ENDPOINTS.patients.me),

  /** PATIENT — update own */
  updateProfile: (data: PatientRequest) =>
    axiosClient.put<PatientDTO>(ENDPOINTS.patients.me, data),

  /** ADMIN — list all paginated */
  getAll: (page = 0, size = 7) =>
    axiosClient.get<PageResponse<PatientDTO>>(ENDPOINTS.patients.base, {
      params: { page, size },
    }),

  /** ADMIN — update by id */
  updateByAdmin: (id: Id, data: PatientRequest) =>
    axiosClient.put<PatientDTO>(ENDPOINTS.patients.byId(id), data),

  /** ADMIN — delete */
  delete: (id: Id) =>
    axiosClient.delete<void>(ENDPOINTS.patients.byId(id)),

  /** DOCTOR — patients of logged-in doctor (paginated) */
  getDoctorPatients: (page = 0, size = 7) =>
    axiosClient.get<PageResponse<PatientDTO>>(ENDPOINTS.patients.doctorMe, {
      params: { page, size },
    }),

  /** DOCTOR — search patients by keyword. The 403 is silenced so the
   *  caller can render an inline error (admin role is not allowed to
   *  use this doctor-side endpoint). */
  searchPatients: (keyword: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PatientDTO>>(ENDPOINTS.patients.doctorMeSearch, {
      params: { keyword, page, size },
      __silent403: true,
    }),

  /** DOCTOR — patients for a specific date */
  getTodayPatients: (date: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PatientDTO>>(ENDPOINTS.patients.doctorMeToday, {
      params: { date, page, size },
    }),

  /** DOCTOR — patients in a date range */
  getWeeklyPatients: (start: string, end: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PatientDTO>>(ENDPOINTS.patients.doctorMeWeekly, {
      params: { start, end, page, size },
    }),
};
