package com.medicnote.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.Doctor;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>{
	
}
