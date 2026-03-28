package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

        logger.info("Fetching patient {}", id);

        Patient patient = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        return mapper.toDTO(patient);
    }

    @Override
    @Transactional
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

        Patient updated = repository.save(patient);

        logger.info("Patient {} updated successfully", id);

        return mapper.toDTO(updated);
    }

    @Override
    public List<PatientResponseDTO> getAll() {

        logger.info("Fetching all patients");

        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {

        logger.info("Deleting patient {}", id);

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found");
        }

        repository.deleteById(id);

        logger.info("Patient {} deleted successfully", id);
    }

    @Override
    public List<PatientResponseDTO> getPatientsByDoctor(Long doctorId) {

        logger.info("Fetching patients for doctor {}", doctorId);

        return repository.findDistinctByAppointmentDoctorId(doctorId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PatientResponseDTO> getPatientsByDoctorPaginated(Long doctorId, int page, int size) {

        logger.info("Fetching paginated patients for doctor {} page {} size {}", doctorId, page, size);

        return repository.findWeeklyPatientsByDoctor(
                doctorId,
                LocalDate.now().minusYears(100),
                LocalDate.now(),
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public List<PatientResponseDTO> searchPatientsByDoctor(Long doctorId, String keyword) {

        logger.info("Searching patients for doctor {} with keyword {}", doctorId, keyword);

        return repository.searchPatientsByDoctor(doctorId, keyword)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PatientResponseDTO> searchPatientsByDoctorPaginated(Long doctorId, String keyword, int page, int size) {

        logger.info("Searching paginated patients for doctor {} keyword {} page {} size {}", doctorId, keyword, page, size);

        return repository.searchPatientsByDoctorPaginated(
                doctorId,
                keyword,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public List<PatientResponseDTO> getTodayPatients(Long doctorId, LocalDate date) {

        logger.info("Fetching today patients for doctor {} on {}", doctorId, date);

        return repository.findTodayPatientsByDoctor(doctorId, date)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PatientResponseDTO> getTodayPatientsPaginated(Long doctorId, LocalDate date, int page, int size) {

        logger.info("Fetching paginated today patients for doctor {} page {} size {}", doctorId, page, size);

        return repository.findTodayPatientsByDoctorPaginated(
                doctorId,
                date,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }

    @Override
    public Page<PatientResponseDTO> getWeeklyPatients(Long doctorId, LocalDate start, LocalDate end, int page, int size) {

        logger.info("Fetching weekly patients for doctor {} from {} to {}", doctorId, start, end);

        return repository.findWeeklyPatientsByDoctor(
                doctorId,
                start,
                end,
                PageRequest.of(page, size)
        ).map(mapper::toDTO);
    }
}