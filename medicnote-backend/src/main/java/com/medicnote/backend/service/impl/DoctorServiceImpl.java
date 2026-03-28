package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.request.DoctorRequestDTO;
import com.medicnote.backend.dto.response.DoctorResponseDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.DoctorMapper;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.service.DoctorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorServiceImpl.class);

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    public DoctorServiceImpl(DoctorRepository doctorRepository,
                             DoctorMapper doctorMapper) {
        this.doctorRepository = doctorRepository;
        this.doctorMapper = doctorMapper;
    }

    @Override
    public DoctorResponseDTO createDoctor(DoctorRequestDTO request) {

        logger.info("Creating doctor with email: {}", request.getEmail());

        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Doctor with this email already exists");
        }

        Doctor doctor = doctorMapper.toEntity(request);
        Doctor saved = doctorRepository.save(doctor);

        return doctorMapper.toDTO(saved);
    }

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {

        logger.info("Fetching doctor with id: {}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return doctorMapper.toDTO(doctor);
    }

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {

        logger.info("Fetching all doctors");

        return doctorRepository.findAll()
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO request) {

        logger.info("Updating doctor with id: {}", id);

        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        existing.setName(request.getName());
        existing.setEmail(request.getEmail());
        existing.setSpecialization(request.getSpecialization());
        existing.setExperience(request.getExperience());

        Doctor updated = doctorRepository.save(existing);

        return doctorMapper.toDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {

        logger.info("Deleting doctor with id: {}", id);

        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found");
        }

        doctorRepository.deleteById(id);
    }

    @Override
    public List<DoctorResponseDTO> searchBySpecialization(String specialization) {

        logger.info("Searching doctors by specialization: {}", specialization);

        return doctorRepository.findBySpecializationIgnoreCase(specialization)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponseDTO> searchBySpecializationAndExperience(String specialization, Integer experience) {

        logger.info("Searching doctors by specialization: {} and experience >= {}", specialization, experience);

        return doctorRepository
                .findBySpecializationIgnoreCaseAndExperienceGreaterThanEqual(specialization, experience)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponseDTO> searchByExperience(Integer experience) {

        logger.info("Searching doctors with experience >= {}", experience);

        return doctorRepository.findByExperienceGreaterThanEqual(experience)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }
}