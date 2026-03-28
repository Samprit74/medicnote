package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.PrescriptionService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    public Page<PrescriptionResponseDTO> getByPatient(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatient(patientId, page, size);
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDoctor(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByDoctor(doctorId, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public PrescriptionResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/patient/me/range")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDateRange(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatientAndDateRange(patientId, start.toString(), end.toString(), page, size);
    }

    @GetMapping("/doctor/me/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Authentication auth,
            @PathVariable Long patientId) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getDoctorPatientPrescriptions(doctorId, patientId);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {

        byte[] pdf = service.generatePdf(id);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=prescription.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}