package com.medicnote.backend.repository;

import com.medicnote.backend.entity.Doctor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
	
}