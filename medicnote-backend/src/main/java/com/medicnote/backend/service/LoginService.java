package com.medicnote.backend.service;

import org.springframework.http.ResponseEntity;

import com.medicnote.backend.dto.SignUpDTO;

public interface LoginService {

	ResponseEntity<?> DoctorLoginserv(SignUpDTO signUpDTO);

	ResponseEntity<?> PatientLoginserv(SignUpDTO signUpDTO);
	
	
}
