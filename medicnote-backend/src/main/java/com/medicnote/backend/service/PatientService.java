package com.medicnote.backend.service;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;

import java.util.List;

public interface PatientService {

    PatientResponseDTO getById(Long id);

    PatientResponseDTO update(Long id, PatientRequestDTO request);

    List<PatientResponseDTO> getAll();

    void delete(Long id);

    List<PatientResponseDTO> getPatientsByDoctor(Long doctorId);
}