package com.medicnote.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.service.AppointmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<String> Appointmentcreating(@Valid @RequestBody AppointmentDTO appointmentdto) {
        return appointmentService.saveAppointment(appointmentdto);
    }

    @GetMapping("/{id}")
    public AppointmentDTO GetAppointmentById(@PathVariable Long id) {
        return appointmentService.GetAppoint(id);
    }

    @PutMapping("/{id}")
    public AppointmentDTO updateAppoint(@PathVariable Long id, @Valid @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.update(id, appointmentDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> DeleteAppoint(@PathVariable Long id) {
        return appointmentService.Delete(id);
    }
}