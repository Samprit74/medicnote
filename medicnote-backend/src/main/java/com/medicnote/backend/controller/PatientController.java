package com.medicnote.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public PatientResponseDTO getById(Authentication auth) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getById(id);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponseDTO update(Authentication auth,
                                     @Valid @RequestBody PatientRequestDTO request) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.update(id, request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientResponseDTO> getAll() {
        return service.getAll();
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

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<PatientResponseDTO> getPatientsByDoctor(@PathVariable Long doctorId) {
        return service.getPatientsByDoctor(doctorId);
    }

    @GetMapping("/doctor/{doctorId}/paginated")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PatientResponseDTO> getPatientsByDoctorPaginated(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        return service.getPatientsByDoctorPaginated(doctorId, page, size);
    }

    @GetMapping("/doctor/{doctorId}/search")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PatientResponseDTO> searchPatients(
            @PathVariable Long doctorId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        return service.searchPatientsByDoctorPaginated(doctorId, keyword, page, size);
    }

    @GetMapping("/doctor/{doctorId}/today")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PatientResponseDTO> getTodayPatients(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return service.getTodayPatientsPaginated(doctorId, date, page, size);
    }

    @GetMapping("/doctor/{doctorId}/weekly")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public Page<PatientResponseDTO> getWeeklyPatients(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {

        return service.getWeeklyPatients(doctorId, start, end, page, size);
    }
}