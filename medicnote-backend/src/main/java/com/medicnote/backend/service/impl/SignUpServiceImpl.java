package com.medicnote.backend.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medicnote.backend.dto.SignUpDTO;
import com.medicnote.backend.entity.SignUpEntity;
import com.medicnote.backend.repository.SignUpRepository;
import com.medicnote.backend.service.LoginService;

@Service
public class SignUpServiceImpl implements LoginService{

	private final SignUpRepository signupRepository;
	private final PasswordEncoder encoder;
	
	public SignUpServiceImpl(SignUpRepository signupRepository,PasswordEncoder encoder) {
		this.signupRepository= signupRepository;
		this.encoder = encoder;
	}
	// Doctor signUp
	@Override
	public ResponseEntity<?> DoctorLoginserv(SignUpDTO signUpDTO) {
		
		SignUpEntity entity = new SignUpEntity();
		
		entity.setName(signUpDTO.getName());
		entity.setUsername(signUpDTO.getUsername());
		entity.setPassword(encoder.encode(signUpDTO.getPassword()));
		entity.setRole("ADMIN");
		
		signupRepository.save(entity);
		
		return ResponseEntity.status(HttpStatus.OK).body(entity);
	}

	
	// Patient signUP
	@Override
	public ResponseEntity<?> PatientLoginserv(SignUpDTO signUpDTO) {
		
		SignUpEntity entity = new SignUpEntity();
		
        entity.setName(signUpDTO.getName());
		entity.setUsername(signUpDTO.getUsername());
		entity.setPassword(encoder.encode(signUpDTO.getPassword()));
		entity.setRole("USER");
		
		signupRepository.save(entity);
		
		return ResponseEntity.status(HttpStatus.OK).body(entity);
	}
	
}
