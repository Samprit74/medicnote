package com.medicnote.backend.service;

import java.util.List;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.dto.response.AvailabilityResponseDTO;

public interface AppointmentService {

    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long patientId);

    List<AppointmentResponseDTO> getDoctorQueue(Long doctorId);

    List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId);

    List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId);

    List<AppointmentResponseDTO> getPatientHistory(Long patientId);

    AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long doctorId);

    void cancelAppointment(Long appointmentId, Long patientId);

    List<AvailabilityResponseDTO> getAvailability(Long doctorId);
}