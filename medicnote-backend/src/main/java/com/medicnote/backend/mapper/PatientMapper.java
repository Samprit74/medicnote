package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.PatientDTO;
import com.medicnote.backend.entity.Patient;

public class PatientMapper {

    public static PatientDTO toDTO(Patient patient) {
        if (patient == null) return null;

        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setEmail(patient.getEmail());
        dto.setAge(patient.getAge());

        return dto;
    }

    public static Patient toEntity(PatientDTO dto) {
        if (dto == null) return null;

        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setAge(dto.getAge());

        return patient;
    }
}