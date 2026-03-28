package com.medicnote.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.dto.SignUpDTO;
import com.medicnote.backend.service.LoginService;



@RestController
@RequestMapping("/api/signUp")
public class SignUpController {
	
	private final LoginService loginService;
	
	
	public SignUpController(LoginService loginService) {
		this.loginService =  loginService;
	}
	@PostMapping("/Doctor")
	public ResponseEntity<?> doctorSignup(@RequestBody SignUpDTO signUpDTO) {
		return loginService.DoctorLoginserv(signUpDTO);
	}
	
	@PostMapping("/patient")
	public ResponseEntity<?> patientSignup(@RequestBody SignUpDTO signUpDTO) {
		return loginService.PatientLoginserv(signUpDTO);
	}
}
