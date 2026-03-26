package com.medicnote.backend.service;

import org.springframework.http.ResponseEntity;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.entity.Appointment;

public interface AppointmentService {

	ResponseEntity<String> saveAppointment(AppointmentDTO appointmentdto);

	AppointmentDTO GetAppoint(Long id);

	AppointmentDTO update(Long id, AppointmentDTO appointmentDTO);

	ResponseEntity<String> Delete(Long id);
}
