package com.medicnote.backend.repository;

import com.medicnote.backend.entity.Prescription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientIdOrderByDateDesc(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByPatientIdAndDateBetween(Long patientId, LocalDate start, LocalDate end);

    List<Prescription> findByDoctorIdAndPatientId(Long doctorId, Long patientId);
}