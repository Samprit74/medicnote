import React, { createContext, useState, useCallback, useEffect } from "react";
import { authService } from "@/services/authService";
import { doctorService } from "@/services/doctorService";
import { patientService } from "@/services/patientService";
import { parseJwt, isTokenExpired } from "@/lib/jwt";
import type { User, UserRole } from "@/types/user.types";
import type { DoctorDTO } from "@/types/doctor.types";
import type { PatientDTO } from "@/types/patient.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

function roleFromBackend(backendRole: string | undefined): UserRole {
  if (backendRole === "ROLE_DOCTOR") return "doctor";
  if (backendRole === "ROLE_ADMIN") return "admin";
  return "patient";
}

async function enrichUser(provisional: User, token: string): Promise<User> {
  const decoded = parseJwt(token);
  if (!decoded) return provisional;
  if (provisional.role === "doctor") {
    try {
      const r = await doctorService.getMyProfile();
      const d: DoctorDTO = r.data;
      return { ...provisional, name: d.name, email: d.email, specialization: d.specialization };
    } catch {
      return provisional;
    }
  }
  if (provisional.role === "patient") {
    try {
      const r = await patientService.getProfile();
      const p: PatientDTO = r.data;
      return { ...provisional, name: p.name, email: p.email, phone: p.phone };
    } catch {
      return provisional;
    }
  }
  return provisional;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await authService.login({ email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);

    const decoded = parseJwt(token);
    if (!decoded) throw new Error("Invalid token");

    const provisional: User = {
      id: Number(decoded.userId ?? 0),
      name: decoded.email ?? email,
      email: decoded.email ?? email,
      role: roleFromBackend(decoded.role as string | undefined),
    };

    const full = await enrichUser(provisional, token);
    setUser(full);
    return full;
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }
    const decoded = parseJwt(token);
    if (!decoded) {
      setUser(null);
      return;
    }
    const provisional: User = {
      id: Number(decoded.userId ?? 0),
      name: decoded.email ?? "",
      email: decoded.email ?? "",
      role: roleFromBackend(decoded.role as string | undefined),
    };
    const full = await enrichUser(provisional, token);
    setUser(full);
  }, []);

  // Hydrate from token on first mount.
  useEffect(() => {
    (async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
