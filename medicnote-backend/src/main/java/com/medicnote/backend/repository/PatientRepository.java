package com.medicnote.backend.repository;

import com.medicnote.backend.entity.Patient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findDistinctByAppointmentDoctorId(Long doctorId);

    @Query("""
        SELECT DISTINCT p FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
        AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Patient> searchPatientsByDoctor(Long doctorId, String keyword);

    @Query("""
        SELECT DISTINCT p FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
        AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<Patient> searchPatientsByDoctorPaginated(
            Long doctorId,
            String keyword,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT p FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate = :date
    """)
    List<Patient> findTodayPatientsByDoctor(Long doctorId, LocalDate date);

    @Query("""
        SELECT DISTINCT p FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate = :date
    """)
    Page<Patient> findTodayPatientsByDoctorPaginated(
            Long doctorId,
            LocalDate date,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT p FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate BETWEEN :start AND :end
    """)
    Page<Patient> findWeeklyPatientsByDoctor(
            Long doctorId,
            LocalDate start,
            LocalDate end,
            Pageable pageable
    );

    @Query("""
        SELECT COUNT(DISTINCT p.id) FROM Patient p
        JOIN p.appointments a
        WHERE a.doctor.id = :doctorId
    """)
    long countPatientsByDoctor(Long doctorId);
}