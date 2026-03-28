package com.medicnote.backend.dto.dashboard;

import java.util.List;

public class DoctorDashboardDTO {

    private Long doctorId;
    private String doctorName;

    private long totalPatients;
    private long todayAppointments;
    private long completedAppointments;

    private List<NextAppointmentDTO> nextAppointments;

    public DoctorDashboardDTO() {}

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public List<NextAppointmentDTO> getNextAppointments() { return nextAppointments; }
    public void setNextAppointments(List<NextAppointmentDTO> nextAppointments) { this.nextAppointments = nextAppointments; }
}