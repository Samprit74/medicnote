package com.medicnote.backend.service;

import com.medicnote.backend.dto.PatientDTO;
import java.util.List;

public interface PatientService {

    PatientDTO savePatient(PatientDTO patientDTO);

    List<PatientDTO> getAllPatients();

    PatientDTO getPatientById(Long id);

    PatientDTO updatePatient(Long id, PatientDTO patientDTO);

    void deletePatient(Long id);
}