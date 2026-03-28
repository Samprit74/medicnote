package com.medicnote.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.medicnote.backend.config.JWT.JwtFilter;
import com.medicnote.backend.entity.SignUpEntity;
import com.medicnote.backend.repository.SignUpRepository;


@Configuration
public class Config {
	

	@Bean
	public SecurityFilterChain SecurityFilterChain(HttpSecurity http,JwtFilter filter) {
		http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
		http.csrf(csrf -> csrf.disable());
		http.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		http.authorizeHttpRequests(authz -> 
		authz.requestMatchers("/api/doctors/**").hasRole("ADMIN")
		.requestMatchers("/api/patients").hasAnyRole("ADMIN","USER")
		.requestMatchers("/api/prescriptions").hasAnyRole("ADMIN","USER")
		.requestMatchers("/api/appointment").hasAnyRole("ADMIN","USER")
		.anyRequest().permitAll()
		);
		return http.build();
	}
	
	@Bean
	public PasswordEncoder encode() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public UserDetailsService userdetailsService(SignUpRepository signupRepository) {
		
		UserDetailsService userDetailsService = new UserDetailsService() {
			
			@Override
			public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
				
				SignUpEntity entity = signupRepository.findByUsername(username).orElseThrow();
				
				UserDetails user = org.springframework.security.core.userdetails.User.withUsername(entity.getUsername())
						.password(entity.getPassword())
						.roles(entity.getRole())
						.build();
				
				return user;
			}
		};
		return userDetailsService;
	}
	
	@Bean
	public AuthenticationProvider authenticationProvider(UserDetailsService detailsService,PasswordEncoder encoder) {
		
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(detailsService);
		authenticationProvider.setPasswordEncoder(encode());
		
		return authenticationProvider;
	}
	
	@Bean
	public AuthenticationManager AuthendicationManager(AuthenticationConfiguration configuration) {
		return configuration.getAuthenticationManager();
	}
	
}
