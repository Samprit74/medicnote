
package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.repository.UserRepository;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.PrescriptionService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger logger =
            LoggerFactory.getLogger(PrescriptionController.class);

    private final PrescriptionService service;
    private final UserRepository userRepository;

    public PrescriptionController(
            PrescriptionService service,
            UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    /**
     * Resolves the authenticated user's doctor profile ID.
     * The JWT principal contains User.id, not Doctor.id.
     */
    private Long resolveDoctorId(Long userId) {
        logger.debug("Resolving doctor profile for userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn("User not found while resolving doctor: userId={}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();

        if (doctor == null) {
            logger.warn(
                    "No doctor profile found for userId={}, role={}",
                    userId,
                    user.getRole()
            );
            throw new AccessDeniedException("Not a doctor");
        }

        logger.debug(
                "Resolved doctor profile: userId={}, doctorId={}",
                userId,
                doctor.getId()
        );

        return doctor.getId();
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO create(
            @Valid @RequestBody PrescriptionRequestDTO request,
            Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info("Creating prescription: doctorUserId={}", userId);

        return service.create(request, userId);
    }

    @PostMapping("/appointment")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingAppointment(
            @RequestParam Long appointmentId,
            @RequestBody(required = false) PrescriptionRequestDTO request,
            Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info(
                "Creating prescription from appointment: appointmentId={}, doctorUserId={}",
                appointmentId,
                userId
        );

        return service.createUsingAppointment(appointmentId, request, userId);
    }

    @PostMapping("/email")
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDTO createUsingEmail(
            @Valid @RequestBody PrescriptionByEmailRequestDTO request,
            Authentication auth) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info("Creating prescription by patient email: doctorUserId={}", userId);

        return service.createUsingEmail(request, userId);
    }

    /**
     * IMPORTANT:
     * Pass User.id to the service. The service resolves User -> Patient
     * and queries prescriptions using Patient.id internally.
     */
    @GetMapping("/patient/me")
    @PreAuthorize("hasRole('PATIENT')")
    public Page<PrescriptionResponseDTO> getByPatient(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info(
                "Fetching patient prescriptions: userId={}, page={}, size={}",
                userId,
                page,
                size
        );

        return service.getByPatient(userId, page, size);
    }

    @GetMapping("/patient/me/date")
    @PreAuthorize("hasRole('PATIENT')")
    public Page<PrescriptionResponseDTO> getByDate(
            Authentication auth,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info(
                "Fetching patient prescriptions by date: userId={}, date={}, page={}, size={}",
                userId,
                date,
                page,
                size
        );

        return service.getByPatientAndDate(userId, date, page, size);
    }

    @GetMapping("/patient/me/doctor")
    @PreAuthorize("hasRole('PATIENT')")
    public Page<PrescriptionResponseDTO> getByDoctor(
            Authentication auth,
            @RequestParam String doctorName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info(
                "Fetching patient prescriptions by doctor: userId={}, doctorName={}, page={}, size={}",
                userId,
                doctorName,
                page,
                size
        );

        return service.getByPatientAndDoctor(userId, doctorName, page, size);
    }

    @GetMapping("/patient/me/range")
    @PreAuthorize("hasRole('PATIENT')")
    public Page<PrescriptionResponseDTO> getByRange(
            Authentication auth,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();

        logger.info(
                "Fetching patient prescriptions by date range: userId={}, start={}, end={}, page={}, size={}",
                userId,
                start,
                end,
                page,
                size
        );

        if (start.isAfter(end)) {
            logger.warn(
                    "Invalid prescription date range: start={} is after end={}, userId={}",
                    start,
                    end,
                    userId
            );
            throw new IllegalArgumentException("Start date must not be after end date");
        }

        return service.getByPatientAndDateRange(
                userId,
                start.toString(),
                end.toString(),
                page,
                size
        );
    }

    @GetMapping("/doctor/me/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Authentication auth,
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long doctorId = resolveDoctorId(userId);

        logger.info(
                "Fetching doctor-patient prescriptions: doctorUserId={}, doctorId={}, patientId={}, page={}, size={}",
                userId,
                doctorId,
                patientId,
                page,
                size
        );

        return service.getDoctorPatientPrescriptions(
                doctorId,
                patientId,
                page,
                size
        );
    }

    @GetMapping("/doctor/me/date")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PrescriptionResponseDTO> getDoctorByDate(
            Authentication auth,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        Long doctorId = resolveDoctorId(userId);

        logger.info(
                "Fetching doctor prescriptions by date: doctorUserId={}, doctorId={}, date={}, page={}, size={}",
                userId,
                doctorId,
                date,
                page,
                size
        );

        return service.getDoctorPrescriptionsByDate(
                doctorId,
                date,
                page,
                size
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public PrescriptionResponseDTO getById(@PathVariable Long id) {

        logger.info("Fetching prescription by id={}", id);

        return service.getById(id);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {

        logger.info("Generating prescription PDF: prescriptionId={}", id);

        byte[] pdf = service.generatePdf(id);

        logger.info("Prescription PDF generated: prescriptionId={}", id);

        return ResponseEntity.ok()
                .header(
                        "Content-Disposition",
                        "attachment; filename=prescription.pdf"
                )
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public PrescriptionResponseDTO getByAppointment(
            @PathVariable Long appointmentId) {
        return service.getByAppointmentId(appointmentId);
    }

}
