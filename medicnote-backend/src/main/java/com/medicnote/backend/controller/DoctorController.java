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

import com.medicnote.backend.DTO.DoctorDTO;
import com.medicnote.backend.Entity.DoctorEntity;
import com.medicnote.backend.service.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

	    @Autowired
	    private DoctorService doctorService;

	    @PostMapping
	    public ResponseEntity<String> createDoctor(@RequestBody DoctorDTO doctorDTO) {
	        return doctorService.createDoctor(doctorDTO);
	    }

	    @GetMapping
	    public List<DoctorDTO> getAllDoctors() {
	        return doctorService.getAllDoctors();
	    }

	    @GetMapping("/{id}")
	    public DoctorDTO getDoctorById(@PathVariable Long id) {
	        return doctorService.getDoctorById(id);
	    }

	    @DeleteMapping("/{id}")
	    public String deleteDoctor(@PathVariable Long id) {
	        doctorService.deleteDoctor(id);
	        return "Doctor deleted successfully";
	    }

	}
