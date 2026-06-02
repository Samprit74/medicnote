import api from "./api";

export const dashboardService = {
    /**
     * 🔹 Doctor dashboard
     * Role: DOCTOR, ADMIN
     */
    getDoctorDashboard: () =>
        api.get("/api/dashboard/doctor/me"),

    /**
     * 🔹 Patient dashboard
     * Role: PATIENT, ADMIN
     */
    getPatientDashboard: () =>
        api.get("/api/dashboard/patient/me"),
};