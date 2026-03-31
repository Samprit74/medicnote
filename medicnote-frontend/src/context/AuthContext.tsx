import React, { createContext, useState, useCallback } from "react";
import type { User, UserRole } from "@/types/user.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const MOCK_USERS: Record<UserRole, User> = {
  doctor: {
    id: "d1",
    name: "Dr. Alisha Nicholls",
    email: "alisha@medcare.com",
    role: "doctor",
    specialization: "Dermatologist",
    location: "Bottrop, Germany",
    dateOfBirth: "17.07.86",
    bloodGroup: "A(II) Rh+",
    workingHours: "9pm - 5am",
  },
  patient: {
    id: "p1",
    name: "John Smith",
    email: "john@example.com",
    role: "patient",
    dateOfBirth: "12.03.92",
    bloodGroup: "O(I) Rh+",
    phone: "+49 176 1234567",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((_email: string, _password: string, role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
