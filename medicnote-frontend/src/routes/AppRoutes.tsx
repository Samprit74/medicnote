import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";

// Doctor pages
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import Patients from "@/pages/doctor/Patients";
import DoctorPrescriptions from "@/pages/doctor/Prescriptions";
import Queue from "@/pages/doctor/Queue";
import DoctorProfile from "@/pages/doctor/Profile";

// Patient pages
import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientPrescriptions from "@/pages/patient/Prescriptions";
import Records from "@/pages/patient/Records";
import PatientProfile from "@/pages/patient/Profile";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Default */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />

    {/* ================= DOCTOR ROUTES ================= */}
    <Route
      path="/doctor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/patients"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <Patients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/prescriptions"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorPrescriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/queue"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <Queue />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/profile"
      element={
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorProfile />
        </ProtectedRoute>
      }
    />

    {/* ================= PATIENT ROUTES ================= */}
    <Route
      path="/patient/dashboard"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/prescriptions"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientPrescriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/records"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Records />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/profile"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientProfile />
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;