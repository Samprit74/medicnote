 package com.medicnote.backend.dto.dashboard;

import java.util.List;

public class PatientDashboardDTO {

    private Long patientId;
    private String patientName;

    private long totalAppointments;
    private long totalPrescriptions;

    private List<UpcomingAppointmentDTO> upcomingAppointments;

    public PatientDashboardDTO() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getTotalPrescriptions() { return totalPrescriptions; }
    public void setTotalPrescriptions(long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }

    public List<UpcomingAppointmentDTO> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<UpcomingAppointmentDTO> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
}