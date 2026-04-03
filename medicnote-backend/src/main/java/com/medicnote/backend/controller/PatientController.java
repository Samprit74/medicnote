package com.medicnote.backend.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponseDTO getMe(Authentication auth) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getById(id);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponseDTO updateMe(Authentication auth,
                                       @Valid @RequestBody PatientRequestDTO request) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.update(id, request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PatientResponseDTO> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {
        return service.getAllPaginated(page, size);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PatientResponseDTO updateByAdmin(@PathVariable Long id,
                                           @Valid @RequestBody PatientRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/doctor/me")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PatientResponseDTO> getDoctorPatients(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getPatientsByDoctorPaginated(userId, page, size);
    }

    @GetMapping("/doctor/me/search")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PatientResponseDTO> searchPatients(
            Authentication auth,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.searchPatientsByDoctorPaginated(userId, keyword, page, size);
    }

    @GetMapping("/doctor/me/today")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PatientResponseDTO> getTodayPatients(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getTodayPatientsPaginated(userId, date, page, size);
    }

    @GetMapping("/doctor/me/weekly")
    @PreAuthorize("hasRole('DOCTOR')")
    public Page<PatientResponseDTO> getWeeklyPatients(
            Authentication auth,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        Long userId = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getWeeklyPatients(userId, start, end, page, size);
    }
}