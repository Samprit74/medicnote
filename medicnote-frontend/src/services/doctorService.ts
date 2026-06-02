import api from "./api";

export const doctorService = {
    /**
     * 🔹 Get logged-in doctor profile
     * Roles: DOCTOR, ADMIN
     */
    getMyProfile: () => api.get("/api/doctors/me"),

    /**
     * 🔹 Get all doctors
     * Roles: ADMIN, PATIENT
     */
    getAllDoctors: () => api.get("/api/doctors"),

    /**
     * 🔹 Create doctor (ADMIN only)
     */
    createDoctor: (data: {
        name: string;
        email: string;
        specialization: string;
        experience: number;
    }) => api.post("/api/doctors", data),

    /**
     * 🔹 Update own profile (DOCTOR, ADMIN)
     */
    updateMyProfile: (data: {
        name: string;
        email: string;
        specialization: string;
        experience: number;
    }) => api.put("/api/doctors/me", data),

    /**
     * 🔹 Admin update doctor
     */
    updateDoctorByAdmin: (
        id: number,
        data: {
            name: string;
            email: string;
            specialization: string;
            experience: number;
        }
    ) => api.put(`/api/doctors/${id}`, data),

    /**
     * 🔹 Delete doctor (ADMIN)
     */
    deleteDoctor: (id: number) =>
        api.delete(`/api/doctors/${id}`),

    /**
     * 🔹 Search doctors (non-paginated)
     */
    searchDoctors: (params: {
        specialization?: string;
        experience?: number;
    }) =>
        api.get("/api/doctors/search", {
            params,
        }),

    /**
     * 🔹 Search doctors (paginated)
     */
    searchDoctorsPaginated: (
        params: {
            specialization?: string;
            experience?: number;
        },
        page = 0,
        size = 7
    ) =>
        api.get("/api/doctors/search-paginated", {
            params: {
                ...params,
                page,
                size,
            },
        }),
};