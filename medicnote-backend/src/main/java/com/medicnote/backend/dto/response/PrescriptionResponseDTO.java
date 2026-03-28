package com.medicnote.backend.dto.response;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionResponseDTO {

    private Long id;

    private LocalDate date;
    private String diagnosis;
    private String notes;

    private Long doctorId;
    private String doctorName;

    private Long patientId;
    private String patientName;

    private List<PrescriptionItemResponseDTO> items;

    public PrescriptionResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public List<PrescriptionItemResponseDTO> getItems() { return items; }
    public void setItems(List<PrescriptionItemResponseDTO> items) { this.items = items; }
}