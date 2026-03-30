package com.medicnote.backend.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;

public interface PatientService {

    PatientResponseDTO getById(Long id);

    PatientResponseDTO update(Long id, PatientRequestDTO request);

    Page<PatientResponseDTO> getAllPaginated(int page, int size);

    void delete(Long id);

    Page<PatientResponseDTO> getPatientsByDoctorPaginated(Long doctorId, int page, int size);

    Page<PatientResponseDTO> searchPatientsByDoctorPaginated(Long doctorId, String keyword, int page, int size);

    Page<PatientResponseDTO> getTodayPatientsPaginated(Long doctorId, LocalDate date, int page, int size);

    Page<PatientResponseDTO> getWeeklyPatients(Long doctorId, LocalDate start, LocalDate end, int page, int size);
}