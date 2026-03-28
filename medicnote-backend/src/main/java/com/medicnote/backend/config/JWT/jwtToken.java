package com.medicnote.backend.config.JWT;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.KEY;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class jwtToken {
	
	@Value("${jwt.secret}")
	private String secretKey ;
	
	private SecretKey key ;
	
	@PostConstruct
	private void init() {
		key = Keys.hmacShaKeyFor(secretKey.getBytes());
	}
	
	public String generateToken(UserDetails details) {
		return Jwts.builder()
				.subject(details.getUsername())
				.claim("Role", details.getAuthorities())
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis()+ 7 * 24 * 60 * 60 * 1000))
				.signWith(key , Jwts.SIG.HS256)
				.compact();
	}
 	
	public boolean ValidationToken(String token,UserDetails userDetails) {
		
		return extractUsername(token).equals(userDetails.getUsername());
		
	}

	public String extractUsername(String token) {
		
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.getSubject();	
	}
}