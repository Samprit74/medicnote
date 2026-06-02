import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  AppointmentDTO,
  AppointmentRequest,
  AvailabilitySlot,
} from "@/types/appointment.types";
import type { Id, PageResponse } from "@/types/api.types";

export const appointmentService = {
  /** PATIENT — book */
  bookAppointment: (data: AppointmentRequest) =>
    axiosClient.post<AppointmentDTO>(ENDPOINTS.appointments.base, data),

  /** DOCTOR, ADMIN — today's queue */
  getDoctorQueue: () =>
    axiosClient.get<AppointmentDTO[]>(ENDPOINTS.appointments.doctorMeQueue),

  /** DOCTOR, ADMIN — paginated appointments for the logged-in doctor */
  getDoctorAppointments: (page = 0, size = 10) =>
    axiosClient.get<PageResponse<AppointmentDTO>>(ENDPOINTS.appointments.doctorMe, {
      params: { page, size },
    }),

  /** PATIENT, ADMIN — paginated appointments for the logged-in patient */
  getPatientAppointments: (page = 0, size = 10) =>
    axiosClient.get<PageResponse<AppointmentDTO>>(ENDPOINTS.appointments.patientMe, {
      params: { page, size },
    }),

  /** PATIENT, ADMIN — history (past appointments) */
  getPatientHistory: (page = 0, size = 10) =>
    axiosClient.get<PageResponse<AppointmentDTO>>(ENDPOINTS.appointments.patientMeHistory, {
      params: { page, size },
    }),

  /** DOCTOR, ADMIN — update status */
  updateStatus: (appointmentId: Id, status: string) =>
    axiosClient.put<AppointmentDTO>(ENDPOINTS.appointments.status(appointmentId), null, {
      params: { status },
    }),

  /** PATIENT, ADMIN — cancel */
  cancelAppointment: (appointmentId: Id) =>
    axiosClient.put<void>(ENDPOINTS.appointments.cancel(appointmentId)),

  /** PATIENT, ADMIN — availability for a doctor (next 2 weeks, weekdays) */
  getAvailability: (doctorId: Id) =>
    axiosClient.get<AvailabilitySlot[]>(
      ENDPOINTS.appointments.doctorAvailability(doctorId)
    ),
};
