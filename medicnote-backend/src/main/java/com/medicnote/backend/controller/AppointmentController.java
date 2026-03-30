package com.medicnote.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.dto.response.AvailabilityResponseDTO;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public AppointmentResponseDTO bookAppointment(@Valid @RequestBody AppointmentRequestDTO request,
                                                  Authentication auth) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.bookAppointment(request, patientId);
    }

    @GetMapping("/doctor/me/queue")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<AppointmentResponseDTO> getDoctorQueue(Authentication auth) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.getDoctorQueue(doctorId);
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<AppointmentResponseDTO> getAppointmentsByDoctor(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.getAppointmentsByDoctor(doctorId, page, size);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<AppointmentResponseDTO> getAppointmentsByPatient(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.getAppointmentsByPatient(patientId, page, size);
    }

    @GetMapping("/patient/me/history")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<AppointmentResponseDTO> getPatientHistory(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.getPatientHistory(patientId, page, size);
    }

    @PutMapping("/{appointmentId}/status")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public AppointmentResponseDTO updateStatus(@PathVariable Long appointmentId,
                                               @RequestParam String status,
                                               Authentication auth) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return appointmentService.updateStatus(appointmentId, status, doctorId);
    }

    @PutMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public void cancelAppointment(@PathVariable Long appointmentId,
                                 Authentication auth) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        appointmentService.cancelAppointment(appointmentId, patientId);
    }

    @GetMapping("/doctor/{doctorId}/availability")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public List<AvailabilityResponseDTO> getAvailability(@PathVariable Long doctorId) {

        return appointmentService.getAvailability(doctorId);
    }
}