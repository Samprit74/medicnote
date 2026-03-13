package com.medicnote.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.medicnote.backend.DTO.PatientDTO;
import com.medicnote.backend.Entity.patientEntity;
import com.medicnote.backend.repository.patientRepo;

@Service
public class patientService {

	    @Autowired
	    private patientRepo patientRepo;


	    public ResponseEntity<String> createPatient(PatientDTO patientDTO) {

	        patientEntity patient = new patientEntity();
	        patient.setPName(patientDTO.getPName());
	        patient.setPAge(patientDTO.getPAge());
	        patient.setPGender(patientDTO.getPGender());

	        patientEntity savedPatient = patientRepo.save(patient);

	        return ResponseEntity.status(HttpStatus.CREATED).body("patient successfully created");
	    }

	    public List<PatientDTO> getAllPatients() {

	        List<patientEntity> patients = patientRepo.findAll();

	        return patients.stream().map(p -> {
	            PatientDTO dto = new PatientDTO();
	            dto.setPId(p.getPId());
	            dto.setPName(p.getPName());
	            dto.setPAge(p.getPAge());
	            dto.setPGender(p.getPGender());
	            return dto;
	        }).collect(Collectors.toList());
	    }


	    public PatientDTO getPatientById(Long id) {

	        patientEntity patient = patientRepo.findById(id).orElseThrow(()-> new RuntimeException("ID didn't valid"));

	        PatientDTO dto = new PatientDTO();
	        dto.setPId(patient.getPId());
	        dto.setPName(patient.getPName());
	        dto.setPAge(patient.getPAge());
	        dto.setPGender(patient.getPGender());

	        return dto;
	    }


	    public void deletePatient(Long id) {

	        patientRepo.deleteById(id);
	    }
}
