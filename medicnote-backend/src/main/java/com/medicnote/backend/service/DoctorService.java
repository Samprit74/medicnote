package com.medicnote.backend.service;

import com.medicnote.backend.dto.request.DoctorRequestDTO;
import com.medicnote.backend.dto.response.DoctorResponseDTO;

import java.util.List;

public interface DoctorService {

    DoctorResponseDTO createDoctor(DoctorRequestDTO request);

    DoctorResponseDTO getDoctorById(Long id);

    List<DoctorResponseDTO> getAllDoctors();

    DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO request);

    void deleteDoctor(Long id);

    List<DoctorResponseDTO> searchBySpecialization(String specialization);

    List<DoctorResponseDTO> searchBySpecializationAndExperience(String specialization, Integer experience);

    List<DoctorResponseDTO> searchByExperience(Integer experience);
}