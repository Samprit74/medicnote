package com.medicnote.backend.service;

import com.medicnote.backend.dto.dashboard.DoctorDashboardDTO;
import com.medicnote.backend.dto.dashboard.PatientDashboardDTO;

public interface DashboardService {

    DoctorDashboardDTO getDoctorDashboard(Long doctorId);

    PatientDashboardDTO getPatientDashboard(Long patientId);
}