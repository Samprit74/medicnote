import React, { createContext, useState, useCallback, useEffect } from "react";
import { authService } from "@/services/authService";
import type { User, UserRole } from "@/types/user.types";

/**
 * Context Type
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Create Context
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => { },
  logout: () => { },
});

/**
 * 🔹 Helper: Decode JWT
 */
const parseJwt = (token: string) => {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * 🔹 LOGIN (REAL API)
   */
  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);

    const token = res.data.token;

    // save token
    localStorage.setItem("token", token);

    // decode token
    const decoded = parseJwt(token);

    if (!decoded) throw new Error("Invalid token");

    // map backend role → frontend role
    let role: UserRole = "patient";

    if (decoded.role === "ROLE_DOCTOR") role = "doctor";
    if (decoded.role === "ROLE_PATIENT") role = "patient";
    if (decoded.role === "ROLE_ADMIN") role = "admin";

    // create minimal user object
    const userData: User = {
      id: decoded.userId,
      name: decoded.email, // fallback (can improve later)
      email: decoded.email,
      role,
    };

    setUser(userData);
  }, []);

  /**
   * 🔹 LOGOUT
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  /**
   * 🔹 Restore session on refresh
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = parseJwt(token);

    if (!decoded) return;

    let role: UserRole = "patient";

    if (decoded.role === "ROLE_DOCTOR") role = "doctor";
    if (decoded.role === "ROLE_PATIENT") role = "patient";
    if (decoded.role === "ROLE_ADMIN") role = "admin";

    setUser({
      id: decoded.userId,
      name: decoded.email,
      email: decoded.email,
      role,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};