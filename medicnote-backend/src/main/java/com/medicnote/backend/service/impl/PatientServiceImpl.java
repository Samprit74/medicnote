package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.PatientMapper;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.service.PatientService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
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

        logger.info("Fetching patient {}", id);

        Patient patient = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return mapper.toDTO(patient);
    }

    @Override
    public PatientResponseDTO update(Long id, PatientRequestDTO request) {

        logger.info("Updating patient {}", id);

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
    public List<PatientResponseDTO> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {

        logger.info("Deleting patient {}", id);

        repository.deleteById(id);
    }

    @Override
    public List<PatientResponseDTO> getPatientsByDoctor(Long doctorId) {

        logger.info("Fetching patients for doctor {}", doctorId);

        return repository.findDistinctByAppointmentDoctorId(doctorId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}