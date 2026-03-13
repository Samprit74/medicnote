package com.medicnote.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.medicnote.backend.DTO.PrescriptionDTO;
import com.medicnote.backend.Entity.DoctorEntity;
import com.medicnote.backend.Entity.PrescriptionEntity;
import com.medicnote.backend.Entity.patientEntity;
import com.medicnote.backend.repository.DoctorRepo;
import com.medicnote.backend.repository.PrescriptionRepo;
import com.medicnote.backend.repository.patientRepo;

@Service
public class PrescriptionService {
	
	    @Autowired
	    private PrescriptionRepo prescriptionRepo;

	    @Autowired
	    private DoctorRepo doctorRepository;

	    @Autowired
	    private patientRepo patientRepository;

	    public ResponseEntity<String> createPrescription(PrescriptionDTO dto){

	        DoctorEntity doctor = doctorRepository.findById(dto.getDoctorId()).orElseThrow();
	        patientEntity patient = patientRepository.findById(dto.getPatientId()).orElseThrow();

	        PrescriptionEntity prescription = new PrescriptionEntity();

	        prescription.setMedicine(dto.getMedicine());
	        prescription.setDosage(dto.getDosage());
	        prescription.setHealthIssue(dto.getHealthIssue());
	        
	        prescription.setDoctor(doctor);
	        prescription.setPatient(patient);

	        PrescriptionEntity saved = prescriptionRepo.save(prescription);

	        saved.setBillNo(999 + saved.getPrId());

	        prescriptionRepo.save(saved);

	        return ResponseEntity.status(HttpStatus.CREATED).body("prescription successfully created");
	    }
	    
	    public PrescriptionDTO getPrescriptionById(Long id){

	        PrescriptionEntity p = prescriptionRepo.findById(id).orElseThrow();

	        PrescriptionDTO dto = new PrescriptionDTO();

	        dto.setPrId(p.getPrId());
	        dto.setMedicine(p.getMedicine());
	        dto.setBillNo(p.getBillNo());
	        dto.setDosage(p.getDosage());
	        dto.setHealthIssue(p.getHealthIssue());
	        dto.setDate(p.getDate());

	        dto.setDoctorId(p.getDoctor().getDId());
	        dto.setPatientId(p.getPatient().getPId());

	        return dto;
	    }
	}
