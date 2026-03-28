package com.medicnote.backend.controller;

import com.medicnote.backend.dto.request.DoctorRequestDTO;
import com.medicnote.backend.dto.response.DoctorResponseDTO;
import com.medicnote.backend.service.DoctorService;
import com.medicnote.backend.security.service.CustomUserDetails;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponseDTO createDoctor(@Valid @RequestBody DoctorRequestDTO request) {
        return doctorService.createDoctor(request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public DoctorResponseDTO getDoctorById(Authentication auth) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return doctorService.getDoctorById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // ✅ FIXED: allow doctor to update own profile
    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public DoctorResponseDTO updateDoctor(Authentication auth,
                                          @Valid @RequestBody DoctorRequestDTO request) {
        Long id = ((CustomUserDetails) auth.getPrincipal()).getId();
        return doctorService.updateDoctor(id, request);
    }

    // ✅ ADMIN can update any doctor
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DoctorResponseDTO updateDoctorByAdmin(@PathVariable Long id,
                                                 @Valid @RequestBody DoctorRequestDTO request) {
        return doctorService.updateDoctor(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public List<DoctorResponseDTO> searchDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Integer experience) {

        if (specialization != null && experience != null) {
            return doctorService.searchBySpecializationAndExperience(specialization, experience);
        }

        if (specialization != null) {
            return doctorService.searchBySpecialization(specialization);
        }

        if (experience != null) {
            return doctorService.searchByExperience(experience);
        }

        return doctorService.getAllDoctors();
    }
}