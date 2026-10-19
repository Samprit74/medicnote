
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private static final Logger logger =
            LoggerFactory.getLogger(DoctorServiceImpl.class);

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    public DoctorServiceImpl(
            DoctorRepository doctorRepository,
            DoctorMapper doctorMapper) {
        this.doctorRepository = doctorRepository;
        this.doctorMapper = doctorMapper;
    }

    @Override
    public DoctorResponseDTO createDoctor(DoctorRequestDTO request) {

        logger.info("Creating doctor with email={}", request.getEmail());

        if (doctorRepository.existsByEmail(request.getEmail())) {
            logger.warn(
                    "Doctor creation rejected: email already exists, email={}",
                    request.getEmail()
            );

            throw new IllegalArgumentException(
                    "Doctor with this email already exists");
        }

        Doctor doctor = doctorMapper.toEntity(request);
        Doctor saved = doctorRepository.save(doctor);

        logger.info(
                "Doctor created successfully: doctorId={}, email={}",
                saved.getId(),
                saved.getEmail()
        );

        return doctorMapper.toDTO(saved);
    }

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {

        logger.info("Fetching doctor: doctorId={}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Doctor not found: doctorId={}", id);
                    return new ResourceNotFoundException("Doctor not found");
                });

        logger.debug("Doctor found: doctorId={}, email={}",
                doctor.getId(), doctor.getEmail());

        return doctorMapper.toDTO(doctor);
    }

    @Override
    public DoctorResponseDTO getDoctorByEmail(String email) {

        logger.info("Fetching doctor by email={}", email);

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Doctor not found for email={}", email);
                    return new ResourceNotFoundException("Doctor not found");
                });

        logger.debug("Doctor found: doctorId={}, email={}",
                doctor.getId(), doctor.getEmail());

        return doctorMapper.toDTO(doctor);
    }

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {

        logger.info("Fetching all doctors");

        List<DoctorResponseDTO> doctors = doctorRepository.findAll()
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());

        logger.info("Fetched {} doctors", doctors.size());

        return doctors;
    }

    @Override
    public DoctorResponseDTO updateDoctor(
            Long id,
            DoctorRequestDTO request) {

        logger.info("Updating doctor: doctorId={}", id);

        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Doctor not found for update: doctorId={}", id);
                    return new ResourceNotFoundException("Doctor not found");
                });

        if (!existing.getEmail().equals(request.getEmail())
                && doctorRepository.existsByEmail(request.getEmail())) {

            logger.warn(
                    "Doctor update rejected: email already in use, doctorId={}, email={}",
                    id,
                    request.getEmail()
            );

            throw new IllegalArgumentException("Email already in use");
        }

        existing.setName(request.getName());
        existing.setEmail(request.getEmail());
        existing.setSpecialization(request.getSpecialization());
        existing.setExperience(request.getExperience());

        Doctor updated = doctorRepository.save(existing);

        logger.info(
                "Doctor updated successfully: doctorId={}, email={}",
                updated.getId(),
                updated.getEmail()
        );

        return doctorMapper.toDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {

        logger.info("Deleting doctor: doctorId={}", id);

        if (!doctorRepository.existsById(id)) {
            logger.warn("Doctor not found for deletion: doctorId={}", id);
            throw new ResourceNotFoundException("Doctor not found");
        }

        doctorRepository.deleteById(id);

        logger.info("Doctor deleted successfully: doctorId={}", id);
    }

    @Override
    public List<DoctorResponseDTO> searchBySpecialization(
            String specialization) {

        logger.info(
                "Searching doctors by specialization={}",
                specialization
        );

        List<DoctorResponseDTO> doctors = doctorRepository
                .findBySpecializationIgnoreCase(specialization)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());

        logger.info(
                "Specialization search returned {} doctors",
                doctors.size()
        );

        return doctors;
    }

    @Override
    public List<DoctorResponseDTO> searchBySpecializationAndExperience(
            String specialization,
            Integer experience) {

        logger.info(
                "Searching doctors: specialization={}, minimumExperience={}",
                specialization,
                experience
        );

        List<DoctorResponseDTO> doctors = doctorRepository
                .findBySpecializationIgnoreCaseAndExperienceGreaterThanEqual(
                        specialization,
                        experience)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());

        logger.info(
                "Specialization and experience search returned {} doctors",
                doctors.size()
        );

        return doctors;
    }

    @Override
    public List<DoctorResponseDTO> searchByExperience(Integer experience) {

        logger.info(
                "Searching doctors with minimumExperience={}",
                experience
        );

        List<DoctorResponseDTO> doctors = doctorRepository
                .findByExperienceGreaterThanEqual(experience)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());

        logger.info(
                "Experience search returned {} doctors",
                doctors.size()
        );

        return doctors;
    }

    @Override
    public List<DoctorResponseDTO> searchBySpecializationSorted(
            String specialization) {

        logger.info(
                "Searching doctors by specialization={}, sorted by experience descending",
                specialization
        );

        List<DoctorResponseDTO> doctors = doctorRepository
                .findBySpecializationIgnoreCaseOrderByExperienceDesc(
                        specialization)
                .stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());

        logger.info(
                "Sorted specialization search returned {} doctors",
                doctors.size()
        );

        return doctors;
    }

    @Override
    public Page<DoctorResponseDTO> searchDoctorsPaginated(
            String specialization,
            Integer experience,
            int page,
            int size) {

        logger.info(
                "Paginated doctor search: specialization={}, minimumExperience={}, page={}, size={}",
                specialization,
                experience,
                page,
                size
        );

        PageRequest pageable = PageRequest.of(page, size);

        Page<DoctorResponseDTO> result;

        if (specialization != null && experience != null) {

            result = doctorRepository
                    .findBySpecializationIgnoreCaseAndExperienceGreaterThanEqual(
                            specialization,
                            experience,
                            pageable)
                    .map(doctorMapper::toDTO);

        } else if (specialization != null) {

            result = doctorRepository
                    .findBySpecializationIgnoreCase(
                            specialization,
                            pageable)
                    .map(doctorMapper::toDTO);

        } else if (experience != null) {

            result = doctorRepository
                    .findByExperienceGreaterThanEqual(
                            experience,
                            pageable)
                    .map(doctorMapper::toDTO);

        } else {

            result = doctorRepository.findAll(pageable)
                    .map(doctorMapper::toDTO);
        }

        logger.info(
                "Paginated doctor search completed: returned={}, totalElements={}, totalPages={}",
                result.getNumberOfElements(),
                result.getTotalElements(),
                result.getTotalPages()
        );

        return result;
    }
}
