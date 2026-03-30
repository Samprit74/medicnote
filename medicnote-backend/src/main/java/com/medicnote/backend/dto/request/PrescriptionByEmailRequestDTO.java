package com.medicnote.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PrescriptionByEmailRequestDTO {

    @NotNull
    private Long appointmentId;

    @NotNull
    private String patientEmail;

    private String diagnosis;

    private String notes;

    @Valid
    @NotEmpty
    private List<PrescriptionItemRequestDTO> items;

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<PrescriptionItemRequestDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemRequestDTO> items) { this.items = items; }
}