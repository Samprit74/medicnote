package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.PatientDTO;
import com.medicnote.backend.entity.Patient;
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

        Patient patient = new Patient();
        patient.setName(patientDTO.getName());
        patient.setEmail(patientDTO.getEmail());
        patient.setAge(patientDTO.getAge());

        Patient savedPatient = patientRepository.save(patient);

        PatientDTO response = new PatientDTO();
        response.setId(savedPatient.getId());
        response.setName(savedPatient.getName());
        response.setEmail(savedPatient.getEmail());
        response.setAge(savedPatient.getAge());

        return response;
    }

    @Override
    public List<PatientDTO> getAllPatients() {

        List<Patient> patients = patientRepository.findAll();

        return patients.stream().map(patient -> {
            PatientDTO dto = new PatientDTO();
            dto.setId(patient.getId());
            dto.setName(patient.getName());
            dto.setEmail(patient.getEmail());
            dto.setAge(patient.getAge());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {

        Patient patient = patientRepository.findById(id).orElseThrow();

        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setEmail(patient.getEmail());
        dto.setAge(patient.getAge());

        return dto;
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {

        Patient patient = patientRepository.findById(id).orElseThrow();

        patient.setName(patientDTO.getName());
        patient.setEmail(patientDTO.getEmail());
        patient.setAge(patientDTO.getAge());

        Patient updatedPatient = patientRepository.save(patient);

        PatientDTO response = new PatientDTO();
        response.setId(updatedPatient.getId());
        response.setName(updatedPatient.getName());
        response.setEmail(updatedPatient.getEmail());
        response.setAge(updatedPatient.getAge());

        return response;
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}