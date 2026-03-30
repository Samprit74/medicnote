package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
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

    @PostMapping("/appointment")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingAppointment(
            @RequestParam Long appointmentId,
            @RequestBody(required = false) PrescriptionRequestDTO request,
            Authentication auth) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.createUsingAppointment(appointmentId, request, doctorId);
    }

    @PostMapping("/email")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingEmail(
            @Valid @RequestBody PrescriptionByEmailRequestDTO request,
            Authentication auth) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.createUsingEmail(request, doctorId);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByPatient(Authentication auth,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "7") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatient(patientId, page, size);
    }

    @GetMapping("/patient/me/date")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDate(Authentication auth,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "7") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatientAndDate(patientId, date, page, size);
    }

    @GetMapping("/patient/me/doctor")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDoctor(Authentication auth,
                                                     @RequestParam String doctorName,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "7") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatientAndDoctor(patientId, doctorName, page, size);
    }

    @GetMapping("/patient/me/range")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByRange(Authentication auth,
                                                    @RequestParam LocalDate start,
                                                    @RequestParam LocalDate end,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "7") int size) {

        Long patientId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getByPatientAndDateRange(patientId, start.toString(), end.toString(), page, size);
    }

    @GetMapping("/doctor/me/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Authentication auth,
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getDoctorPatientPrescriptions(doctorId, patientId, page, size);
    }

    @GetMapping("/doctor/me/date")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PrescriptionResponseDTO> getDoctorByDate(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long doctorId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getDoctorPrescriptionsByDate(doctorId, date, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public PrescriptionResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
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