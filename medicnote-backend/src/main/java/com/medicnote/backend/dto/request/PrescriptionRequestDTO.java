package com.medicnote.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionRequestDTO {

    @NotNull
    private Long patientId;

    @NotNull
    private LocalDate date;

    private String diagnosis;

    private String notes;

    @Valid
    @NotEmpty
    private List<PrescriptionItemRequestDTO> items;

    public PrescriptionRequestDTO() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<PrescriptionItemRequestDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemRequestDTO> items) { this.items = items; }
}