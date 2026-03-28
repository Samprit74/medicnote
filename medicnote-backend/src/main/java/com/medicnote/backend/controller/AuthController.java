package com.medicnote.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicnote.backend.config.JWT.jwtToken;
import com.medicnote.backend.dto.SignUpDTO;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthenticationManager authenticationManager;
	
	@Autowired
	jwtToken jwtToken;
	
	
	@PostMapping
	public ResponseEntity<Map<String, String>> loginform(@RequestBody SignUpDTO SignUpDTO) {
	
		try {
			Authentication authentication =  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(SignUpDTO.getUsername(),SignUpDTO.getPassword()));
			UserDetails userDetails=(UserDetails)authentication.getPrincipal();
			String token=jwtToken.generateToken(userDetails);
			
			return ResponseEntity.ok(Map.of("Token",token));
		} catch (Exception e) {
			System.out.println(SignUpDTO.getUsername() +" "+ SignUpDTO.getPassword());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Map.of("Token ","Username Or Password is Invalid")));
		}
	}	
}
