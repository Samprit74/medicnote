import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

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
import Doctors from "@/pages/patient/Doctors";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Default */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forbidden" element={<Forbidden />} />

    {/* ================= ADMIN ROUTES ================= */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    {/* ================= DOCTOR ROUTES ================= */}
    <Route
      path="/doctor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/patients"
      element={
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <Patients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/prescriptions"
      element={
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <DoctorPrescriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/queue"
      element={
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <Queue />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor/profile"
      element={
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <DoctorProfile />
        </ProtectedRoute>
      }
    />

    {/* ================= PATIENT ROUTES ================= */}
    <Route
      path="/patient/dashboard"
      element={
        <ProtectedRoute allowedRoles={["patient", "admin"]}>
          <PatientDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/prescriptions"
      element={
        <ProtectedRoute allowedRoles={["patient", "admin"]}>
          <PatientPrescriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/doctors"
      element={
        <ProtectedRoute allowedRoles={["patient", "admin"]}>
          <Doctors />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/records"
      element={
        <ProtectedRoute allowedRoles={["patient", "admin"]}>
          <Records />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient/profile"
      element={
        <ProtectedRoute allowedRoles={["patient", "admin"]}>
          <PatientProfile />
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
