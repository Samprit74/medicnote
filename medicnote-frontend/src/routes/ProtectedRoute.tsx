import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "doctor" | "patient";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
