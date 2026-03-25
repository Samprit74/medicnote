package com.medicnote.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.service.AppointmentService;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
	
	private final AppointmentService appointmentService;
	
	public AppointmentController(AppointmentService appointmentService) {
		this.appointmentService = appointmentService;
	}
	@PostMapping
	public ResponseEntity<String> Appointmentcreating(@RequestBody AppointmentDTO appointmentdto) {
	
		return appointmentService.saveAppointment(appointmentdto);
	}
	@GetMapping("/{id}")
	public AppointmentDTO GetAppointmentById(@PathVariable	 Long id) {
		return appointmentService.GetAppoint(id);
	}
	
	@PutMapping("/{id}")
	public AppointmentDTO updateAppoint(@PathVariable Long id,@RequestBody AppointmentDTO appointmentDTO) {
		return appointmentService.update(id,appointmentDTO);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> DeleteAppoint(@PathVariable Long id) {
		return appointmentService.Delete(id);
	}
}
