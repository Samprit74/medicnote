package com.medicnote.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.DTO.PrescriptionDTO;
import com.medicnote.backend.service.PrescriptionService;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

	    @Autowired
	    private PrescriptionService prescriptionService;

	    @PostMapping
	    public ResponseEntity<String> createPrescription(@RequestBody PrescriptionDTO dto){
	        return prescriptionService.createPrescription(dto);
	    }

	}

