package com.medicnote.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // =========================
    // 🔒 THREAD-SAFE LOCK METHOD
    // =========================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate")
    List<Appointment> findByDoctorIdAndDateForUpdate(Long doctorId, LocalDate appointmentDate);

    // =========================
    // EXISTING METHODS
    // =========================

    // Count excluding CANCELLED
    long countByDoctorIdAndAppointmentDateAndStatusNot(
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );

    // Prevent duplicate booking (same doctor + same day)
    boolean existsByPatientIdAndDoctorIdAndAppointmentDateAndStatusNot(
            Long patientId,
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );

    // Prevent SAME TIME booking across ANY doctor
    boolean existsByPatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long patientId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            AppointmentStatus status
    );

    // =========================
    // OTHER METHODS
    // =========================

    List<Appointment> findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
            Long doctorId,
            LocalDate appointmentDate
    );

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByPatientIdAndAppointmentDateBefore(Long patientId, LocalDate date);

    List<Appointment> findByDoctorIdAndAppointmentDateAndStatus(
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );

    List<Appointment> findByPatientIdAndAppointmentDateGreaterThanEqualAndStatus(
            Long patientId,
            LocalDate date,
            AppointmentStatus status
    );
}