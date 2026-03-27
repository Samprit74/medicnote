package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.DoctorDTO;
import com.medicnote.backend.entity.Doctor;

public class DoctorMapper {

    public static DoctorDTO toDTO(Doctor doctor) {
        if (doctor == null) return null;

        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setEmail(doctor.getEmail());
        dto.setSpecialization(doctor.getSpecialization());

        return dto;
    }

    public static Doctor toEntity(DoctorDTO dto) {
        if (dto == null) return null;

        Doctor doctor = new Doctor();
        doctor.setId(dto.getId());
        doctor.setName(dto.getName());
        doctor.setEmail(dto.getEmail());
        doctor.setSpecialization(dto.getSpecialization());

        return doctor;
    }
}