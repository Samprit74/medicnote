package com.medicnote.backend.dto.dashboard;

import java.time.LocalTime;

public class NextAppointmentDTO {

    private String patientName;
    private LocalTime time;

    public NextAppointmentDTO() {}

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
}