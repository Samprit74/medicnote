package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.request.DoctorRequestDTO;
import com.medicnote.backend.dto.response.DoctorResponseDTO;
import com.medicnote.backend.entity.Doctor;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    Doctor toEntity(DoctorRequestDTO dto);

    DoctorResponseDTO toDTO(Doctor doctor);
}