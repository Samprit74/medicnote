package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.DoctorDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.DoctorMapper;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.service.DoctorService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public DoctorDTO saveDoctor(DoctorDTO doctorDTO) {

        Doctor doctor = DoctorMapper.toEntity(doctorDTO);
        Doctor saved = doctorRepository.save(doctor);

        return DoctorMapper.toDTO(saved);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(DoctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return DoctorMapper.toDTO(doctor);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {

        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        existing.setName(doctorDTO.getName());
        existing.setEmail(doctorDTO.getEmail());
        existing.setSpecialization(doctorDTO.getSpecialization());

        Doctor updated = doctorRepository.save(existing);

        return DoctorMapper.toDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {

        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found");
        }

        doctorRepository.deleteById(id);
    }
}