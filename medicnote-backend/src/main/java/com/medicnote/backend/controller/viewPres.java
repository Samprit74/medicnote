package com.medicnote.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.DTO.PrescriptionDTO;
import com.medicnote.backend.service.PrescriptionService;

@RestController
@RequestMapping("/viewPrescription")
public class viewPres {

	@Autowired
	private PrescriptionService PrescriptionService;
	
	@GetMapping("/{id}")
	public PrescriptionDTO getPrescriptionById(@PathVariable Long id){
	    return PrescriptionService.getPrescriptionById(id);
	}
	
}
