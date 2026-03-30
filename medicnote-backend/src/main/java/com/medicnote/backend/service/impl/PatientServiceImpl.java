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
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.PatientMapper;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.service.PatientService;

@Service
@Transactional(readOnly = true)
public class PatientServiceImpl implements PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    private final PatientRepository repository;
    private final PatientMapper mapper;

    public PatientServiceImpl(PatientRepository repository, PatientMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public PatientResponseDTO getById(Long id) {

        Patient patient = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return mapper.toDTO(patient);
    }

    @Override
    @Transactional
    public PatientResponseDTO update(Long id, PatientRequestDTO request) {

        Patient patient = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

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
    public Page<PatientResponseDTO> getPatientsByDoctorPaginated(Long doctorId, int page, int size) {

        return repository.findDistinctByAppointmentsDoctorId(
                doctorId,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> searchPatientsByDoctorPaginated(Long doctorId, String keyword, int page, int size) {

        return repository.searchPatientsByDoctorPaginated(
                doctorId,
                keyword,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getTodayPatientsPaginated(Long doctorId, LocalDate date, int page, int size) {

        return repository.findTodayPatientsByDoctorPaginated(
                doctorId,
                date,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getWeeklyPatients(Long doctorId, LocalDate start, LocalDate end, int page, int size) {

        return repository.findWeeklyPatientsByDoctor(
                doctorId,
                start,
                end,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }
}