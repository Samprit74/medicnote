package com.medicnote.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;

public interface PatientService {

    PatientResponseDTO getById(Long id);

    PatientResponseDTO update(Long id, PatientRequestDTO request);

    List<PatientResponseDTO> getAll();

    void delete(Long id);

    List<PatientResponseDTO> getPatientsByDoctor(Long doctorId);

    Page<PatientResponseDTO> getPatientsByDoctorPaginated(Long doctorId, int page, int size);

    List<PatientResponseDTO> searchPatientsByDoctor(Long doctorId, String keyword);

    Page<PatientResponseDTO> searchPatientsByDoctorPaginated(Long doctorId, String keyword, int page, int size);

    List<PatientResponseDTO> getTodayPatients(Long doctorId, LocalDate date);

    Page<PatientResponseDTO> getTodayPatientsPaginated(Long doctorId, LocalDate date, int page, int size);

    Page<PatientResponseDTO> getWeeklyPatients(Long doctorId, LocalDate start, LocalDate end, int page, int size);
}