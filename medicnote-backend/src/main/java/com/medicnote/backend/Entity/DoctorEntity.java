package com.medicnote.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorEntity {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long dId;

	    @Column(name = "d_name")
	    private String dName;

	    @Column(name = "d_specialization")
	    private String dSpecialization;

	}

