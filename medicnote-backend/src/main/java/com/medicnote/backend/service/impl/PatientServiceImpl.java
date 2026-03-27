package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.PatientDTO;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.mapper.PatientMapper;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.service.PatientService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public PatientDTO savePatient(PatientDTO patientDTO) {

        Patient patient = PatientMapper.toEntity(patientDTO);
        Patient saved = patientRepository.save(patient);

        return PatientMapper.toDTO(saved);
    }

    @Override
    public List<PatientDTO> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(PatientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return PatientMapper.toDTO(patient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {

        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        existing.setName(patientDTO.getName());
        existing.setEmail(patientDTO.getEmail());
        existing.setAge(patientDTO.getAge());

        Patient updated = patientRepository.save(existing);

        return PatientMapper.toDTO(updated);
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}