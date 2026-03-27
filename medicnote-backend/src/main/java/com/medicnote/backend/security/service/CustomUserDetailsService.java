package com.medicnote.backend.security.service;

import java.util.Collections;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.medicnote.backend.entity.User;
import com.medicnote.backend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole().name())
                ))
                .build();
    }
}