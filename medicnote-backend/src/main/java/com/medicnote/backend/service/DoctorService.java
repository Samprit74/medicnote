package com.medicnote.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.medicnote.backend.DTO.DoctorDTO;
import com.medicnote.backend.Entity.DoctorEntity;
import com.medicnote.backend.repository.DoctorRepo;

@Service
public class DoctorService {

	    @Autowired
	    private DoctorRepo doctorRepo;

	    public ResponseEntity<String> createDoctor(DoctorDTO doctorDTO) {

	        DoctorEntity doctor = new DoctorEntity(); 
	        doctor.setDName(doctorDTO.getDName());
	        doctor.setDSpecialization(doctorDTO.getDSpecialization());

	        doctorRepo.save(doctor);
	        
	        return ResponseEntity.status(HttpStatus.CREATED).body("successfully Created");
	    }

	    public List<DoctorDTO> getAllDoctors() {

	        List<DoctorEntity> doctors = doctorRepo.findAll();

	        return doctors.stream().map(doc -> {
	            DoctorDTO dto = new DoctorDTO();
	            dto.setDId(doc.getDId());
	            dto.setDName(doc.getDName());
	            dto.setDSpecialization(doc.getDSpecialization());
	            return dto;
	        }).collect(Collectors.toList());
	    }


	    public DoctorDTO getDoctorById(Long id) {

	        DoctorEntity doctor = doctorRepo.findById(id).orElseThrow(() -> new RuntimeException("ID didn't exist"));

	        DoctorDTO dto = new DoctorDTO();
	        dto.setDId(doctor.getDId());
	        dto.setDName(doctor.getDName());
	        dto.setDSpecialization(doctor.getDSpecialization());

	        return dto;
	    }


	    public void deleteDoctor(Long id) {

	        doctorRepo.deleteById(id);
	   }
}
