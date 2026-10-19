
        package com.medicnote.backend.service.impl;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.mapper.PatientMapper;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.repository.UserRepository;
import com.medicnote.backend.service.PatientService;

@Service
@Transactional(readOnly = true)
public class PatientServiceImpl implements PatientService {

    private static final Logger logger =
            LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository repository;
    private final PatientMapper mapper;
    private final UserRepository userRepository;

    public PatientServiceImpl(
            PatientRepository repository,
            PatientMapper mapper,
            UserRepository userRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    @Override
    public PatientResponseDTO getById(Long userId) {
        logger.info("Fetching patient profile for userId={}", userId);

        Patient patient = resolvePatient(userId);

        logger.info(
                "Patient profile resolved successfully: userId={}, patientId={}",
                userId,
                patient.getId()
        );

        return mapper.toDTO(patient);
    }

    @Override
    @Transactional
    public PatientResponseDTO update(
            Long userId,
            PatientRequestDTO request) {

        logger.info("Updating patient profile for userId={}", userId);

        Patient patient = resolvePatient(userId);

        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());

        Patient savedPatient = repository.save(patient);

        logger.info(
                "Patient profile updated successfully: userId={}, patientId={}",
                userId,
                savedPatient.getId()
        );

        return mapper.toDTO(savedPatient);
    }

    @Override
    public Page<PatientResponseDTO> getAllPaginated(int page, int size) {
        logger.info(
                "Fetching all patients: page={}, size={}",
                page,
                size
        );

        return repository.findAll(PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        logger.info("Deleting patient with patientId={}", id);

        if (!repository.existsById(id)) {
            logger.warn("Patient not found for deletion: patientId={}", id);
            throw new ResourceNotFoundException("Patient not found");
        }

        repository.deleteById(id);

        logger.info("Patient deleted successfully: patientId={}", id);
    }

    @Override
    public Page<PatientResponseDTO> getPatientsByDoctorPaginated(
            Long userId,
            int page,
            int size) {

        logger.info(
                "Fetching patients for doctor: userId={}, page={}, size={}",
                userId,
                page,
                size
        );

        Long doctorId = resolveDoctorId(userId);

        return repository.findDistinctByAppointmentsDoctorId(
                        doctorId,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> searchPatientsByDoctorPaginated(
            Long userId,
            String keyword,
            int page,
            int size) {

        logger.info(
                "Searching patients for doctor: userId={}, keyword={}, page={}, size={}",
                userId,
                keyword,
                page,
                size
        );

        Long doctorId = resolveDoctorId(userId);

        return repository.searchPatientsByDoctorPaginated(
                        doctorId,
                        keyword,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getTodayPatientsPaginated(
            Long userId,
            LocalDate date,
            int page,
            int size) {

        logger.info(
                "Fetching today's patients: doctorUserId={}, date={}, page={}, size={}",
                userId,
                date,
                page,
                size
        );

        Long doctorId = resolveDoctorId(userId);

        return repository.findTodayPatientsByDoctorPaginated(
                        doctorId,
                        date,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getWeeklyPatients(
            Long userId,
            LocalDate start,
            LocalDate end,
            int page,
            int size) {

        logger.info(
                "Fetching weekly patients: doctorUserId={}, start={}, end={}, page={}, size={}",
                userId,
                start,
                end,
                page,
                size
        );

        Long doctorId = resolveDoctorId(userId);

        return repository.findWeeklyPatientsByDoctor(
                        doctorId,
                        start,
                        end,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    private Patient resolvePatient(Long userId) {
        logger.debug(
                "Resolving patient profile for userId={}",
                userId
        );

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn(
                            "Cannot resolve patient: user not found, userId={}",
                            userId
                    );
                    return new ResourceNotFoundException("User not found");
                });

        logger.debug(
                "User loaded: userId={}, role={}, patientProfilePresent={}",
                userId,
                user.getRole(),
                user.getPatient() != null
        );

        Patient patient = user.getPatient();

        if (patient == null) {
            logger.error(
                    "PATIENT PROFILE NULL in PatientServiceImpl.resolvePatient(): userId={}, role={}",
                    userId,
                    user.getRole()
            );

            throw new AccessDeniedException("Not a patient");
        }

        logger.debug(
                "Patient resolved: userId={}, patientId={}",
                userId,
                patient.getId()
        );

        return patient;
    }

    private Long resolveDoctorId(Long userId) {
        logger.debug(
                "Resolving doctor profile for userId={}",
                userId
        );

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.warn(
                            "Cannot resolve doctor: user not found, userId={}",
                            userId
                    );
                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();

        if (doctor == null) {
            logger.warn(
                    "DOCTOR PROFILE NULL in PatientServiceImpl.resolveDoctorId(): userId={}, role={}",
                    userId,
                    user.getRole()
            );

            throw new AccessDeniedException("Not a doctor");
        }

        logger.debug(
                "Doctor resolved: userId={}, doctorId={}",
                userId,
                doctor.getId()
        );

        return doctor.getId();
    }
}
