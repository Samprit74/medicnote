import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  PrescriptionByEmailRequest,
  PrescriptionDTO,
  PrescriptionRequest,
} from "@/types/prescription.types";
import type { Id, PageResponse } from "@/types/api.types";

export const prescriptionService = {
  /** DOCTOR — create using an appointment inside the body */
  create: (data: PrescriptionRequest) =>
    axiosClient.post<PrescriptionDTO>(ENDPOINTS.prescriptions.base, data),

  /** DOCTOR — create using appointmentId as a query param */
  createWithAppointment: (appointmentId: number, data?: PrescriptionRequest) =>
    axiosClient.post<PrescriptionDTO>(ENDPOINTS.prescriptions.appointment, data ?? null, {
      params: { appointmentId },
    }),

  /** DOCTOR — create using appointment + patient email */
  createWithEmail: (data: PrescriptionByEmailRequest) =>
    axiosClient.post<PrescriptionDTO>(ENDPOINTS.prescriptions.email, data),

  /* ------------------------------------------------------------------
   * Patient-side reads (logged-in patient's own prescriptions)
   * ------------------------------------------------------------------ */

  /** PATIENT, ADMIN — all prescriptions of the logged-in patient */
  getMyPrescriptions: (page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(ENDPOINTS.prescriptions.patientMe, {
      params: { page, size },
    }),

  /** PATIENT, ADMIN — by date */
  getMyPrescriptionsByDate: (date: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(ENDPOINTS.prescriptions.patientMeDate, {
      params: { date, page, size },
    }),

  /** PATIENT, ADMIN — by doctor name */
  getMyPrescriptionsByDoctor: (doctorName: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(ENDPOINTS.prescriptions.patientMeDoctor, {
      params: { doctorName, page, size },
    }),

  /** PATIENT, ADMIN — by date range */
  getMyPrescriptionsByRange: (start: string, end: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(ENDPOINTS.prescriptions.patientMeRange, {
      params: { start, end, page, size },
    }),

  /* ------------------------------------------------------------------
   * Doctor-side reads (a doctor viewing a specific patient)
   * ------------------------------------------------------------------ */

  /** DOCTOR, ADMIN — prescriptions for one patient of the logged-in doctor */
  getDoctorPatientPrescriptions: (patientId: Id, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(
      ENDPOINTS.prescriptions.doctorMePatient(patientId),
      { params: { page, size } }
    ),

  /** DOCTOR, ADMIN — prescriptions for the doctor on a specific date */
  getDoctorPrescriptionsByDate: (date: string, page = 0, size = 7) =>
    axiosClient.get<PageResponse<PrescriptionDTO>>(ENDPOINTS.prescriptions.doctorMeDate, {
      params: { date, page, size },
    }),

  /* ------------------------------------------------------------------
   * Single prescription
   * ------------------------------------------------------------------ */

  /** PATIENT, DOCTOR, ADMIN — fetch one */
  getById: (id: Id) =>
    axiosClient.get<PrescriptionDTO>(ENDPOINTS.prescriptions.byId(id)),

  /** PATIENT, DOCTOR, ADMIN — PDF download */
  download: (id: Id) =>
    axiosClient.get<Blob>(ENDPOINTS.prescriptions.download(id), {
      responseType: "blob",
    }),
};
