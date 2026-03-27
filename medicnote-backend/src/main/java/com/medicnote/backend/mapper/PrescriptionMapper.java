package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.PrescriptionDTO;
import com.medicnote.backend.entity.Prescription;

public class PrescriptionMapper {

    public static PrescriptionDTO toDTO(Prescription prescription) {
        if (prescription == null) return null;

        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setMedicine(prescription.getMedicine());
        dto.setDosage(prescription.getDosage());
        dto.setNotes(prescription.getNotes());
        dto.setDate(prescription.getDate());

        if (prescription.getDoctor() != null) {
            dto.setDoctorId(prescription.getDoctor().getId());
        }

        if (prescription.getPatient() != null) {
            dto.setPatientId(prescription.getPatient().getId());
        }

        return dto;
    }

    public static Prescription toEntity(PrescriptionDTO dto) {
        if (dto == null) return null;

        Prescription prescription = new Prescription();
        prescription.setId(dto.getId());
        prescription.setMedicine(dto.getMedicine());
        prescription.setDosage(dto.getDosage());
        prescription.setNotes(dto.getNotes());
        prescription.setDate(dto.getDate());

        return prescription;
    }
}