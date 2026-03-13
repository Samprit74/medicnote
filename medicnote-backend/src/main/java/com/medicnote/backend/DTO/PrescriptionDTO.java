package com.medicnote.backend.DTO;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PrescriptionDTO {

	    private Long prId;
	    private String medicine;
	    private Long BillNo;
	    private String dosage;
	    private String healthIssue;
	    private LocalDate date;

	    private Long doctorId;
	    private Long patientId;

	}
