import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import Patients from "@/pages/doctor/Patients";
import DoctorPrescriptions from "@/pages/doctor/Prescriptions";
import Queue from "@/pages/doctor/Queue";
import DoctorProfile from "@/pages/doctor/Profile";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientPrescriptions from "@/pages/patient/Prescriptions";
import Records from "@/pages/patient/Records";
import PatientProfile from "@/pages/patient/Profile";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />

    {/* Doctor Routes */}
    <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
    <Route path="/doctor/patients" element={<ProtectedRoute allowedRole="doctor"><Patients /></ProtectedRoute>} />
    <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRole="doctor"><DoctorPrescriptions /></ProtectedRoute>} />
    <Route path="/doctor/queue" element={<ProtectedRoute allowedRole="doctor"><Queue /></ProtectedRoute>} />
    <Route path="/doctor/profile" element={<ProtectedRoute allowedRole="doctor"><DoctorProfile /></ProtectedRoute>} />

    {/* Patient Routes */}
    <Route path="/patient/dashboard" element={<ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>} />
    <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRole="patient"><PatientPrescriptions /></ProtectedRoute>} />
    <Route path="/patient/records" element={<ProtectedRoute allowedRole="patient"><Records /></ProtectedRoute>} />
    <Route path="/patient/profile" element={<ProtectedRoute allowedRole="patient"><PatientProfile /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
