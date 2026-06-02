import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";
import type { AuthRequest, AuthResponse, RegisterRequest } from "@/types/auth.types";

export const authService = {
  login: (data: AuthRequest) =>
    axiosClient.post<AuthResponse>(ENDPOINTS.auth.login, data),

  register: (data: RegisterRequest) =>
    axiosClient.post<string>(ENDPOINTS.auth.register, data),
};
