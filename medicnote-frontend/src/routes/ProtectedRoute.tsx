import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // ✅ multiple roles support
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuth();

  /**
   * 🔴 Not logged in
   */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  /**
   * 🔴 Role not allowed
   */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect based on actual role
    if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    if (user.role === "patient") {
      return <Navigate to="/patient/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;