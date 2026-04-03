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

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository repository;
    private final PatientMapper mapper;
    private final UserRepository userRepository;

    public PatientServiceImpl(PatientRepository repository,
            PatientMapper mapper,
            UserRepository userRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    @Override
    public PatientResponseDTO getById(Long userId) {

        Patient patient = resolvePatient(userId);

        return mapper.toDTO(patient);
    }

    @Override
    @Transactional
    public PatientResponseDTO update(Long userId, PatientRequestDTO request) {

        Patient patient = resolvePatient(userId);

        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());

        return mapper.toDTO(repository.save(patient));
    }

    @Override
    public Page<PatientResponseDTO> getAllPaginated(int page, int size) {
        return repository.findAll(PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found");
        }

        repository.deleteById(id);
    }

    @Override
    public Page<PatientResponseDTO> getPatientsByDoctorPaginated(Long userId, int page, int size) {

        Long doctorId = resolveDoctorId(userId);

        return repository.findDistinctByAppointmentsDoctorId(
                doctorId,
                PageRequest.of(page, size)).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> searchPatientsByDoctorPaginated(Long userId, String keyword, int page, int size) {

        Long doctorId = resolveDoctorId(userId);

        return repository.searchPatientsByDoctorPaginated(
                doctorId,
                keyword,
                PageRequest.of(page, size)).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getTodayPatientsPaginated(Long userId, LocalDate date, int page, int size) {

        Long doctorId = resolveDoctorId(userId);

        return repository.findTodayPatientsByDoctorPaginated(
                doctorId,
                date,
                PageRequest.of(page, size)).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getWeeklyPatients(Long userId, LocalDate start, LocalDate end, int page, int size) {

        Long doctorId = resolveDoctorId(userId);

        return repository.findWeeklyPatientsByDoctor(
                doctorId,
                start,
                end,
                PageRequest.of(page, size)).map(mapper::toDTO);
    }

    private Patient resolvePatient(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = user.getPatient();

        if (patient == null) {
            throw new AccessDeniedException("Not a patient");
        }

        return patient;
    }

    private Long resolveDoctorId(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Doctor doctor = user.getDoctor();

        if (doctor == null) {
            throw new AccessDeniedException("Not a doctor");
        }

        return doctor.getId();
    }
}