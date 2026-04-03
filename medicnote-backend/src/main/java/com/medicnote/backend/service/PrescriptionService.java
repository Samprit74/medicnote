package com.medicnote.backend.service;

import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;

import org.springframework.data.domain.Page;

import java.time.LocalDate;

public interface PrescriptionService {

    PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long userId);

    PrescriptionResponseDTO createUsingAppointment(Long appointmentId, PrescriptionRequestDTO request, Long userId);

    PrescriptionResponseDTO createUsingEmail(PrescriptionByEmailRequestDTO request, Long userId);

    Page<PrescriptionResponseDTO> getByPatient(Long patientId, int page, int size);

    Page<PrescriptionResponseDTO> getByPatientAndDate(Long patientId, LocalDate date, int page, int size);

    Page<PrescriptionResponseDTO> getByPatientAndDoctor(Long patientId, String doctorName, int page, int size);

    Page<PrescriptionResponseDTO> getByPatientAndDateRange(Long patientId, String start, String end, int page, int size);

    Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId, int page, int size);

    Page<PrescriptionResponseDTO> getDoctorPrescriptionsByDate(Long doctorId, LocalDate date, int page, int size);

    PrescriptionResponseDTO getById(Long id);

    byte[] generatePdf(Long id);
}