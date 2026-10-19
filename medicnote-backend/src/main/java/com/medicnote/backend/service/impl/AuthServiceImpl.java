
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
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
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
    @Transactional
    public String register(RegisterRequest request) {

        logger.info(
                "Starting user registration: email={}, role={}",
                request.getEmail(),
                request.getRole()
        );

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn(
                    "Registration rejected: email already exists, email={}",
                    request.getEmail()
            );

            throw new ResourceAlreadyExistsException(
                    "Email already exists");
        }

        if (request.getRole() == null) {
            logger.warn(
                    "Registration rejected: role is missing, email={}",
                    request.getEmail()
            );

            throw new IllegalArgumentException("Role is required");
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        logger.info(
                "User account created: userId={}, email={}, role={}",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        // Doctor registration
        if (request.getRole() == Role.ROLE_DOCTOR) {

            logger.debug(
                    "Creating doctor profile for userId={}",
                    savedUser.getId()
            );

            if (request.getSpecialization() == null
                    || request.getSpecialization().isBlank()) {

                logger.warn(
                        "Doctor registration rejected: specialization missing, userId={}",
                        savedUser.getId()
                );

                throw new IllegalArgumentException(
                        "Specialization is required for doctor");
            }

            if (request.getExperience() == null) {

                logger.warn(
                        "Doctor registration rejected: experience missing, userId={}",
                        savedUser.getId()
                );

                throw new IllegalArgumentException(
                        "Experience is required for doctor");
            }

            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setExperience(request.getExperience());

            // Link User and Doctor
            doctor.setUser(savedUser);
            savedUser.setDoctor(doctor);

            Doctor savedDoctor = doctorRepository.save(doctor);

            logger.info(
                    "Doctor profile created and linked: userId={}, doctorId={}, email={}",
                    savedUser.getId(),
                    savedDoctor.getId(),
                    savedDoctor.getEmail()
            );
        }

        // Patient registration
        if (request.getRole() == Role.ROLE_PATIENT) {

            logger.debug(
                    "Creating patient profile for userId={}",
                    savedUser.getId()
            );

            Patient patient = new Patient();
            patient.setName(request.getName());
            patient.setEmail(request.getEmail());
            patient.setAge(0);

            // Link User and Patient
            patient.setUser(savedUser);
            savedUser.setPatient(patient);

            Patient savedPatient = patientRepository.save(patient);

            logger.info(
                    "Patient profile created and linked: userId={}, patientId={}, email={}",
                    savedUser.getId(),
                    savedPatient.getId(),
                    savedPatient.getEmail()
            );
        }

        logger.info(
                "User registration completed successfully: userId={}, role={}",
                savedUser.getId(),
                savedUser.getRole()
        );

        return "User registered successfully";
    }

    @Override
    public AuthResponse login(AuthRequest request) {

        logger.info(
                "Login attempt received for email={}",
                request.getEmail()
        );

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.core.AuthenticationException ex) {
            logger.warn(
                    "Authentication failed for email={}: {}",
                    request.getEmail(),
                    ex.getClass().getSimpleName()
            );

            throw ex;
        }

        logger.debug(
                "Credentials authenticated successfully for email={}",
                request.getEmail()
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.error(
                            "Authenticated user was not found in database: email={}",
                            request.getEmail()
                    );

                    return new IllegalStateException(
                            "Authenticated user not found");
                });

        logger.info(
                "User loaded after authentication: userId={}, role={}",
                user.getId(),
                user.getRole()
        );

        logger.debug(
                "Generating JWT for authenticated userId={}",
                user.getId()
        );

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        logger.info(
                "JWT generated successfully for userId={}, role={}",
                user.getId(),
                user.getRole()
        );

        return new AuthResponse(token);
    }
}
