import api from "./api";

export const authService = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};
