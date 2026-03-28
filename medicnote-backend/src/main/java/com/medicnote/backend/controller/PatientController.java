package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;
import com.medicnote.backend.service.PatientService;
import com.medicnote.backend.security.service.CustomUserDetails;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    // ✅ Only patient can access own data
    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponseDTO getById(Authentication auth) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.getById(id);
    }

    // ✅ Only patient updates own profile
    @PutMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public PatientResponseDTO update(Authentication auth,
                                    @Valid @RequestBody PatientRequestDTO request) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return service.update(id, request);
    }

    // ✅ ADMIN: get all patients
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PatientResponseDTO> getAll() {
        return service.getAll();
    }

    // ✅ ADMIN: update any patient
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PatientResponseDTO updateByAdmin(@PathVariable Long id,
                                            @Valid @RequestBody PatientRequestDTO request) {
        return service.update(id, request);
    }

    // ✅ ADMIN: delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ✅ Doctor/Admin: view patients by doctor
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public List<PatientResponseDTO> getPatientsByDoctor(@PathVariable Long doctorId) {
        return service.getPatientsByDoctor(doctorId);
    }
}