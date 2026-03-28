package com.medicnote.backend.controller;

import com.medicnote.backend.dto.dashboard.DoctorDashboardDTO;
import com.medicnote.backend.dto.dashboard.PatientDashboardDTO;
import com.medicnote.backend.service.DashboardService;
import com.medicnote.backend.security.service.CustomUserDetails;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public DoctorDashboardDTO getDoctorDashboard(Authentication auth) {
        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return dashboardService.getDoctorDashboard(doctorId);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public PatientDashboardDTO getPatientDashboard(Authentication auth) {
        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return dashboardService.getPatientDashboard(patientId);
    }
}