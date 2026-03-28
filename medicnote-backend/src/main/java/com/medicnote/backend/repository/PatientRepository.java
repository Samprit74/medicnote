package com.medicnote.backend.repository;

import com.medicnote.backend.entity.Patient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findDistinctByAppointmentDoctorId(Long doctorId);
}