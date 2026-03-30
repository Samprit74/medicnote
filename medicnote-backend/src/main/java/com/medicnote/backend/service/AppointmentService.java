package com.medicnote.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.dto.response.AvailabilityResponseDTO;

public interface AppointmentService {

    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long patientId);

    List<AppointmentResponseDTO> getDoctorQueue(Long doctorId);

    Page<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId, int page, int size);

    Page<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId, int page, int size);

    Page<AppointmentResponseDTO> getPatientHistory(Long patientId, int page, int size);

    AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long doctorId);

    void cancelAppointment(Long appointmentId, Long patientId);

    List<AvailabilityResponseDTO> getAvailability(Long doctorId);
}