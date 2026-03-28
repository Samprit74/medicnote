package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.request.PatientRequestDTO;
import com.medicnote.backend.dto.response.PatientResponseDTO;
import com.medicnote.backend.entity.Patient;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    Patient toEntity(PatientRequestDTO dto);

    PatientResponseDTO toDTO(Patient patient);
}