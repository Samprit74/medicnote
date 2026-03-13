package com.medicnote.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.DTO.PatientDTO;
import com.medicnote.backend.service.patientService;

@RestController
@RequestMapping("/patients")

public class patientController {

	    @Autowired
	    private patientService patientService;

	    @PostMapping
	    public ResponseEntity<String> createPatient(@RequestBody PatientDTO patientDTO){
	        return patientService.createPatient(patientDTO);
	    }

	    @GetMapping
	    public List<PatientDTO> getAllPatients(){
	        return patientService.getAllPatients();
	    }

	    @GetMapping("/{id}")
	    public PatientDTO getPatientById(@PathVariable Long id){
	        return patientService.getPatientById(id);
	    }

	    @DeleteMapping("/{id}")
	    public String deletePatient(@PathVariable Long id){
	        patientService.deletePatient(id);
	        return "Patient deleted successfully";
	  }
}
