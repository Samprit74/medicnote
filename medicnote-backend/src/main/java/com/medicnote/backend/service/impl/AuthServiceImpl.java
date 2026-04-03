package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.auth.AuthRequest;
import com.medicnote.backend.dto.auth.AuthResponse;
import com.medicnote.backend.dto.auth.RegisterRequest;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.exception.ResourceAlreadyExistsException;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.repository.UserRepository;
import com.medicnote.backend.security.enums.Role;
import com.medicnote.backend.security.jwt.JwtUtil;
import com.medicnote.backend.service.AuthService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        logger.info("Registering user {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        // ✅ Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        // ================= DOCTOR =================
        if (request.getRole() == Role.ROLE_DOCTOR) {

            if (request.getSpecialization() == null || request.getSpecialization().isBlank()) {
                throw new IllegalArgumentException("Specialization is required for doctor");
            }

            if (request.getExperience() == null) {
                throw new IllegalArgumentException("Experience is required for doctor");
            }

            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail()); // keep for now (no breaking change)
            doctor.setSpecialization(request.getSpecialization());
            doctor.setExperience(request.getExperience());

            // ✅ LINK USER ↔ DOCTOR
            doctor.setUser(user);
            user.setDoctor(doctor);

            doctorRepository.save(doctor);
        }

        // ================= PATIENT =================
        if (request.getRole() == Role.ROLE_PATIENT) {

            Patient patient = new Patient();
            patient.setName(request.getName());
            patient.setEmail(request.getEmail()); // keep for now
            patient.setAge(0); // default (avoid null issues)

            // ✅ LINK USER ↔ PATIENT
            patient.setUser(user);
            user.setPatient(patient);

            patientRepository.save(patient);
        }

        return "User registered successfully";
    }

    @Override
    public AuthResponse login(AuthRequest request) {

        logger.info("Authenticating user {}", request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(token);
    }
}