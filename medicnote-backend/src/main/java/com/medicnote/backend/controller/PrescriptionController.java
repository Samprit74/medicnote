package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.service.PrescriptionService;
import com.medicnote.backend.security.service.CustomUserDetails;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO create(@Valid @RequestBody PrescriptionRequestDTO request,
                                          Authentication auth) {
        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.create(request, doctorId);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public List<PrescriptionResponseDTO> getByPatient(Authentication auth) {
        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatient(patientId);
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<PrescriptionResponseDTO> getByDoctor(Authentication auth) {
        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByDoctor(doctorId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public PrescriptionResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/patient/me/range")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public List<PrescriptionResponseDTO> getByDateRange(
            Authentication auth,
            @RequestParam String start,
            @RequestParam String end) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatientAndDateRange(patientId, start, end);
    }

    @GetMapping("/doctor/me/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Authentication auth,
            @PathVariable Long patientId) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getDoctorPatientPrescriptions(doctorId, patientId);
    }
}