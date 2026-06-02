import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { DoctorDashboardDTO, PatientDashboardDTO } from "@/types/dashboard.types";

export const dashboardService = {
  /** DOCTOR, ADMIN */
  getDoctorDashboard: () =>
    axiosClient.get<DoctorDashboardDTO>(ENDPOINTS.dashboard.doctorMe),

  /** PATIENT, ADMIN */
  getPatientDashboard: () =>
    axiosClient.get<PatientDashboardDTO>(ENDPOINTS.dashboard.patientMe),
};
