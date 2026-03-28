package com.medicnote.backend.dto.dashboard;

import java.time.LocalDate;
import java.time.LocalTime;

public class UpcomingAppointmentDTO {

    private String doctorName;
    private LocalDate date;
    private LocalTime time;

    public UpcomingAppointmentDTO() {}

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
}