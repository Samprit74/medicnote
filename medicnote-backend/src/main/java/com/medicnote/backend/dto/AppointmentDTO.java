package com.medicnote.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentDTO {

	    private Long id;

	    private Long patientId;
	    private Long doctorId;

	    private LocalDate appointmentDate;
	    private LocalTime appointmentTime;

	    private String status;
	    private String reason;
		public AppointmentDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public Long getPatientId() {
			return patientId;
		}
		public void setPatientId(Long patientId) {
			this.patientId = patientId;
		}
		public Long getDoctorId() {
			return doctorId;
		}
		public void setDoctorId(Long doctorId) {
			this.doctorId = doctorId;
		}
		public LocalDate getAppointmentDate() {
			return appointmentDate;
		}
		public void setAppointmentDate(LocalDate appointmentDate) {
			this.appointmentDate = appointmentDate;
		}
		public LocalTime getAppointmentTime() {
			return appointmentTime;
		}
		public void setAppointmentTime(LocalTime appointmentTime) {
			this.appointmentTime = appointmentTime;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public String getReason() {
			return reason;
		}
		public void setReason(String reason) {
			this.reason = reason;
		}
	    
	    
}
