package com.medicnote.backend.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.AppointmentMapper;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public ResponseEntity<String> saveAppointment(AppointmentDTO dto) {

        Appointment appointment = AppointmentMapper.toEntity(dto);
        appointment.setStatus("Appointment as scheduled");

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);

        appointmentRepository.save(appointment);

        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment created");
    }

    @Override
    public AppointmentDTO GetAppoint(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        return AppointmentMapper.toDTO(appointment);
    }

    @Override
    public AppointmentDTO update(Long id, AppointmentDTO dto) {

        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        existing.setAppointmentDate(dto.getAppointmentDate());
        existing.setAppointmentTime(dto.getAppointmentTime());
        existing.setReason(dto.getReason());

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        existing.setDoctor(doctor);
        existing.setPatient(patient);

        Appointment updated = appointmentRepository.save(existing);

        return AppointmentMapper.toDTO(updated);
    }

    @Override
    public ResponseEntity<String> Delete(Long id) {

        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found");
        }

        appointmentRepository.deleteById(id);
        return ResponseEntity.ok("Appointment cancelled");
    }
}