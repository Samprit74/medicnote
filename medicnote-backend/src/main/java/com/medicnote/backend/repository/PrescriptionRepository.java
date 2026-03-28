package com.medicnote.backend.repository;

import java.time.LocalDate;
import java.util.List;
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
    Page<Prescription> findByDoctorIdOrderByDateDesc(Long doctorId, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByPatientIdAndDateBetweenOrderByDateDesc(
            Long patientId,
            LocalDate start,
            LocalDate end,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    List<Prescription> findByDoctorIdAndPatientIdOrderByDateDesc(Long doctorId, Long patientId);

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Page<Prescription> findByDoctorIdAndDiagnosisContainingIgnoreCaseOrderByDateDesc(
            Long doctorId,
            String keyword,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"items", "doctor", "patient"})
    Optional<Prescription> findWithDetailsById(Long id);
}