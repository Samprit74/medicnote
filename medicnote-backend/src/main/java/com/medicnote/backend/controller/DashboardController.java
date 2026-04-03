package com.medicnote.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.dto.dashboard.DoctorDashboardDTO;
import com.medicnote.backend.dto.dashboard.PatientDashboardDTO;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<DoctorDashboardDTO> getDoctorDashboard(Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return ResponseEntity.ok(dashboardService.getDoctorDashboard(userId));
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public ResponseEntity<PatientDashboardDTO> getPatientDashboard(Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return ResponseEntity.ok(dashboardService.getPatientDashboard(userId));
    }
}