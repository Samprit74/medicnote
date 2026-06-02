import api from "./api";

export const appointmentService = {
    /**
     * 🔹 Book appointment (PATIENT)
     */
    bookAppointment: (data: {
        doctorId: number;
        appointmentDate: string; // YYYY-MM-DD
    }) => api.post("/api/appointments", data),

    /**
     * 🔹 Doctor queue (today)
     */
    getDoctorQueue: () =>
        api.get("/api/appointments/doctor/me/queue"),

    /**
     * 🔹 Doctor appointments (paginated)
     */
    getDoctorAppointments: (page = 0, size = 10) =>
        api.get("/api/appointments/doctor/me", {
            params: { page, size },
        }),

    /**
     * 🔹 Patient appointments (paginated)
     */
    getPatientAppointments: (page = 0, size = 10) =>
        api.get("/api/appointments/patient/me", {
            params: { page, size },
        }),

    /**
     * 🔹 Patient appointment history
     */
    getPatientHistory: (page = 0, size = 10) =>
        api.get("/api/appointments/patient/me/history", {
            params: { page, size },
        }),

    /**
     * 🔹 Update status (DOCTOR)
     * status = PENDING | COMPLETED | CANCELLED
     */
    updateStatus: (appointmentId: number, status: string) =>
        api.put(`/api/appointments/${appointmentId}/status`, null, {
            params: { status },
        }),

    /**
     * 🔹 Cancel appointment (PATIENT)
     */
    cancelAppointment: (appointmentId: number) =>
        api.put(`/api/appointments/${appointmentId}/cancel`),

    /**
     * 🔹 Get doctor availability
     */
    getAvailability: (doctorId: number) =>
        api.get(`/api/appointments/doctor/${doctorId}/availability`),
};