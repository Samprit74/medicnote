package com.medicnote.backend.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService{

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
	public ResponseEntity<String> saveAppointment(AppointmentDTO appointmentdto) {
	
		Appointment appointment = new Appointment();
		
		appointment.setStatus("Appointment as schedule");
		appointment.setAppointmentDate(appointmentdto.getAppointmentDate());
		appointment.setReason(appointmentdto.getReason());
		appointment.setAppointmentTime(appointmentdto.getAppointmentTime());
		
		Doctor doctor = doctorRepository.findById(appointmentdto.getDoctorId()).orElseThrow(() -> new RuntimeException("invalid Doctor 'ID'"));
		Patient patient = patientRepository.findById(appointmentdto.getPatientId()).orElseThrow(() -> new RuntimeException("invalid Patiend 'ID'"));
		      
		appointment.setDoctor(doctor);
		appointment.setPatient(patient);
		
		appointmentRepository.save(appointment);
		
		return ResponseEntity.status(HttpStatus.CREATED).body("Appointment as applyed");
		    }

	@Override
	public AppointmentDTO GetAppoint(Long id) {
		Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("invalid Id"));
		
		AppointmentDTO appointmentDTO = new AppointmentDTO();
		
		appointmentDTO.setId(appointment.getId());
		appointmentDTO.setPatientId(appointment.getPatient().getId());
		appointmentDTO.setDoctorId(appointment.getDoctor().getId());
		appointmentDTO.setAppointmentDate(appointment.getAppointmentDate());
		appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
		appointmentDTO.setReason(appointment.getReason());
		appointmentDTO.setStatus(appointment.getStatus());
		
		return appointmentDTO;
	}

	@Override
	public AppointmentDTO update(Long id, AppointmentDTO appointmentdto) {
		Appointment appointment = appointmentRepository.findById(id).orElseThrow();
		
		appointment.setAppointmentDate(appointmentdto.getAppointmentDate());
		appointment.setReason(appointmentdto.getReason());
		appointment.setAppointmentTime(appointmentdto.getAppointmentTime());
		
		Doctor doctor = doctorRepository.findById(appointmentdto.getDoctorId()).orElseThrow(() -> new RuntimeException("invalid Doctor 'ID'"));
		Patient patient = patientRepository.findById(appointmentdto.getPatientId()).orElseThrow(() -> new RuntimeException("invalid Patiend 'ID'"));
		      
		appointment.setDoctor(doctor);
		appointment.setPatient(patient);
		
		Appointment UpdatedAppointment = appointmentRepository.save(appointment);
		
		AppointmentDTO appointmentDTO = new AppointmentDTO();
		appointmentDTO.setId(UpdatedAppointment.getId());
		appointmentDTO.setPatientId(UpdatedAppointment.getPatient().getId());
		appointmentDTO.setDoctorId(UpdatedAppointment.getDoctor().getId());
		appointmentDTO.setAppointmentDate(UpdatedAppointment.getAppointmentDate());
		appointmentDTO.setAppointmentTime(UpdatedAppointment.getAppointmentTime());
		appointmentDTO.setReason(UpdatedAppointment.getReason());
		appointmentDTO.setStatus(UpdatedAppointment.getStatus());
		
		return appointmentDTO;
	}

	@Override
	public ResponseEntity<String> Delete(Long id) {
		appointmentRepository.deleteById(id);
		return ResponseEntity.ok("Appointment as canceled");
	}
}

