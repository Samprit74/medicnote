package com.medicnote.backend.service;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;

import org.springframework.data.domain.Page;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long doctorId);

    Page<PrescriptionResponseDTO> getByPatient(Long patientId, int page, int size);

    Page<PrescriptionResponseDTO> getByDoctor(Long doctorId, int page, int size);

    Page<PrescriptionResponseDTO> getByPatientAndDateRange(Long patientId, String start, String end, int page, int size);

    PrescriptionResponseDTO getById(Long id);

    List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId);

    byte[] generatePdf(Long id);
}