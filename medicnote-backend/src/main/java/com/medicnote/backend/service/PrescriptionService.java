package com.medicnote.backend.service;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;

import java.util.List;

public interface PrescriptionService {

    
    PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long doctorId);

    List<PrescriptionResponseDTO> getByPatient(Long patientId);

    List<PrescriptionResponseDTO> getByDoctor(Long doctorId);

    PrescriptionResponseDTO getById(Long id);

    List<PrescriptionResponseDTO> getByPatientAndDateRange(Long patientId, String start, String end);

    List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId);
}