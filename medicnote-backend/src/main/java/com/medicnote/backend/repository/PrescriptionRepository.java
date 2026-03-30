package com.medicnote.backend.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicnote.backend.entity.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByPatientIdOrderByDateDesc(Long patientId, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByPatientIdAndDateBetweenOrderByDateDesc(
            Long patientId,
            LocalDate start,
            LocalDate end,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByDoctorIdAndPatientIdOrderByDateDesc(
            Long doctorId,
            Long patientId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Optional<Prescription> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByPatientIdAndDate(
            Long patientId,
            LocalDate date,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByPatientIdAndDoctorNameContainingIgnoreCase(
            Long patientId,
            String doctorName,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByDoctorIdAndDate(
            Long doctorId,
            LocalDate date,
            Pageable pageable
    );

    boolean existsByDoctorIdAndPatientIdAndDate(
            Long doctorId,
            Long patientId,
            LocalDate date
    );

    long countByPatientId(Long patientId);
}