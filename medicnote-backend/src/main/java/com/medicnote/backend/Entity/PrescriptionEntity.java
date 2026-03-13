package com.medicnote.backend.Entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionEntity {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long prId;

	    @NotBlank
	    private String medicine;

	    private Long BillNo;
	    
	    @NotBlank
	    private String healthIssue;
	    
	    @NotBlank
	    private String dosage;

	    private LocalDate date=LocalDate.now();

	    @ManyToOne
	    @JoinColumn(name = "doctor_id")
	    private DoctorEntity doctor;

	    @ManyToOne
	    @JoinColumn(name = "patient_id")
	    private patientEntity patient;

	}
