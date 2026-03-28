package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.entity.Appointment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "patient.name", target = "patientName")
    AppointmentResponseDTO toDTO(Appointment appointment);
}