package com.medicnote.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.AppointmentStatus;

import jakarta.persistence.LockModeType;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate")
    List<Appointment> findByDoctorIdAndDateForUpdate(Long doctorId, LocalDate appointmentDate);

    long countByDoctorIdAndAppointmentDateAndStatusNot(
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );

    boolean existsByPatientIdAndDoctorIdAndAppointmentDateAndStatusNot(
            Long patientId,
            Long doctorId,
            LocalDate appointmentDate,
            AppointmentStatus status
    );

    boolean existsByPatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long patientId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            AppointmentStatus status
    );

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

    long countDistinctPatientIdByDoctor_Id(Long doctorId);

    long countByPatientId(Long patientId);

    long countByDoctorIdAndAppointmentDateAndStatus(
            Long doctorId,
            LocalDate date,
            AppointmentStatus status
    );

    List<Appointment> findTop2ByDoctorIdAndAppointmentDateAndStatusOrderByQueueNumberAsc(
            Long doctorId,
            LocalDate date,
            AppointmentStatus status
    );

    List<Appointment> findTop3ByPatientIdAndAppointmentDateAfterAndStatusOrderByAppointmentDateAsc(
            Long patientId,
            LocalDate date,
            AppointmentStatus status
    );

    

    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    Page<Appointment> findByPatientIdAndAppointmentDateBefore(
            Long patientId,
            LocalDate date,
            Pageable pageable
    );

    @Query("""
        SELECT 
            a.appointmentDate,
            COUNT(a)
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate BETWEEN :start AND :end
        AND a.status != com.medicnote.backend.entity.AppointmentStatus.CANCELLED
        GROUP BY a.appointmentDate
    """)
    List<Object[]> countAppointmentsGroupedByDate(Long doctorId, LocalDate start, LocalDate end);

    @Query("""
        SELECT 
            COUNT(a),
            SUM(CASE WHEN a.status = com.medicnote.backend.entity.AppointmentStatus.COMPLETED THEN 1 ELSE 0 END)
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.appointmentDate BETWEEN :start AND :end
        AND a.status != com.medicnote.backend.entity.AppointmentStatus.CANCELLED
    """)
    Object[] getDashboardStats(Long doctorId, LocalDate start, LocalDate end);
}