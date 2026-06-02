import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { DoctorDTO, DoctorRequest } from "@/types/doctor.types";
import type { Id, PageResponse } from "@/types/api.types";

export const doctorService = {
  /** DOCTOR, ADMIN — own profile */
  getMyProfile: () =>
    axiosClient.get<DoctorDTO>(ENDPOINTS.doctors.me),

  /** ADMIN, PATIENT — list all */
  getAllDoctors: () =>
    axiosClient.get<DoctorDTO[]>(ENDPOINTS.doctors.base),

  /** ADMIN — create */
  createDoctor: (data: DoctorRequest) =>
    axiosClient.post<DoctorDTO>(ENDPOINTS.doctors.base, data),

  /** DOCTOR, ADMIN — update own */
  updateMyProfile: (data: DoctorRequest) =>
    axiosClient.put<DoctorDTO>(ENDPOINTS.doctors.me, data),

  /** ADMIN — update by id */
  updateDoctorByAdmin: (id: Id, data: DoctorRequest) =>
    axiosClient.put<DoctorDTO>(ENDPOINTS.doctors.byId(id), data),

  /** ADMIN — delete */
  deleteDoctor: (id: Id) =>
    axiosClient.delete<void>(ENDPOINTS.doctors.byId(id)),

  /** ADMIN, PATIENT — search (non-paginated) */
  searchDoctors: (params: { specialization?: string; experience?: number }) =>
    axiosClient.get<DoctorDTO[]>(ENDPOINTS.doctors.search, { params }),

  /** ADMIN, PATIENT — search paginated */
  searchDoctorsPaginated: (
    params: { specialization?: string; experience?: number },
    page = 0,
    size = 7
  ) =>
    axiosClient.get<PageResponse<DoctorDTO>>(ENDPOINTS.doctors.searchPaginated, {
      params: { ...params, page, size },
    }),
};
