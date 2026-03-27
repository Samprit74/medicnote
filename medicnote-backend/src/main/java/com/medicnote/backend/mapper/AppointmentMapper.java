package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.AppointmentDTO;
import com.medicnote.backend.entity.Appointment;

public class AppointmentMapper {

    public static AppointmentDTO toDTO(Appointment appointment) {
        if (appointment == null) return null;

        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setStatus(appointment.getStatus());
        dto.setReason(appointment.getReason());

        if (appointment.getPatient() != null) {
            dto.setPatientId(appointment.getPatient().getId());
        }

        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getId());
        }

        return dto;
    }

    public static Appointment toEntity(AppointmentDTO dto) {
        if (dto == null) return null;

        Appointment appointment = new Appointment();
        appointment.setId(dto.getId());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setStatus(dto.getStatus());
        appointment.setReason(dto.getReason());

        return appointment;
    }
}