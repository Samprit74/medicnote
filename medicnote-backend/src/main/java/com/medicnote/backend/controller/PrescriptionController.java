package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

    public PrescriptionController(PrescriptionService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    /**
     * The patient-side endpoints receive the JWT principal's id, which is the
     * User.id (PK of the users table). The service methods filter prescriptions
     * by Patient.id (PK of the patients table). Resolve the User → Patient
     * link here so the query targets the correct row.
     */
    private Long resolvePatientId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = user.getPatient();
        if (patient == null) {
            throw new AccessDeniedException("Not a patient");
        }
        return patient.getId();
    }

    /**
     * Same idea for doctor users: JWT gives User.id, service filters by
     * Doctor.id. Resolve via the User → Doctor link.
     */
    private Long resolveDoctorId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = user.getDoctor();
        if (doctor == null) {
            throw new AccessDeniedException("Not a doctor");
        }
        return doctor.getId();
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO create(@Valid @RequestBody PrescriptionRequestDTO request,
                                          Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.create(request, userId);
    }

    @PostMapping("/appointment")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingAppointment(
            @RequestParam Long appointmentId,
            @RequestBody(required = false) PrescriptionRequestDTO request,
            Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.createUsingAppointment(appointmentId, request, userId);
    }

    @PostMapping("/email")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingEmail(
            @Valid @RequestBody PrescriptionByEmailRequestDTO request,
            Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.createUsingEmail(request, userId);
    }

    @GetMapping("/patient/me")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByPatient(Authentication auth,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long patientId = resolvePatientId(userId);
        return service.getByPatient(patientId, page, size);
    }

    @GetMapping("/patient/me/date")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDate(Authentication auth,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long patientId = resolvePatientId(userId);
        return service.getByPatientAndDate(patientId, date, page, size);
    }

    @GetMapping("/patient/me/doctor")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByDoctor(Authentication auth,
                                                     @RequestParam String doctorName,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long patientId = resolvePatientId(userId);
        return service.getByPatientAndDoctor(patientId, doctorName, page, size);
    }

    @GetMapping("/patient/me/range")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public Page<PrescriptionResponseDTO> getByRange(Authentication auth,
                                                    @RequestParam LocalDate start,
                                                    @RequestParam LocalDate end,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long patientId = resolvePatientId(userId);
        return service.getByPatientAndDateRange(patientId, start.toString(), end.toString(), page, size);
    }

    @GetMapping("/doctor/me/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Authentication auth,
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long doctorId = resolveDoctorId(userId);
        return service.getDoctorPatientPrescriptions(doctorId, patientId, page, size);
    }

    @GetMapping("/doctor/me/date")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PrescriptionResponseDTO> getDoctorByDate(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long doctorId = resolveDoctorId(userId);
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