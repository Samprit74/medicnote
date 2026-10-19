package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.medicnote.backend.dto.dashboard.DoctorDashboardDTO;
import com.medicnote.backend.dto.dashboard.NextAppointmentDTO;
import com.medicnote.backend.dto.dashboard.PatientDashboardDTO;
import com.medicnote.backend.dto.dashboard.UpcomingAppointmentDTO;
import com.medicnote.backend.entity.AppointmentStatus;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.repository.UserRepository;
import com.medicnote.backend.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger logger =
            LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(
            AppointmentRepository appointmentRepository,
            PrescriptionRepository prescriptionRepository,
            UserRepository userRepository) {

        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DoctorDashboardDTO getDoctorDashboard(Long userId) {

        logger.info("Fetching doctor dashboard for userId={}", userId);

        Doctor doctor = resolveDoctor(userId);
        Long doctorId = doctor.getId();

        logger.debug(
                "Resolved doctor profile: userId={}, doctorId={}, doctorName={}",
                userId, doctorId, doctor.getName());

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);

        long totalPatients = safeCount(
                "countDistinctPatientIdByDoctor_Id",
                () -> appointmentRepository
                        .countDistinctPatientIdByDoctor_Id(doctorId));

        long todayAppointments = safeCount(
                "countByDoctorIdAndAppointmentDateAndStatusNot",
                () -> appointmentRepository
                        .countByDoctorIdAndAppointmentDateAndStatusNot(
                                doctorId,
                                today,
                                AppointmentStatus.CANCELLED));

        long completedAppointments = safeCount(
                "countByDoctorIdAndAppointmentDateAndStatus",
                () -> appointmentRepository
                        .countByDoctorIdAndAppointmentDateAndStatus(
                                doctorId,
                                today,
                                AppointmentStatus.COMPLETED));

        long totalAppointmentsInWindow = 0;
        long completedAppointmentsInWindow = 0;

        try {
            logger.debug(
                    "Fetching doctor dashboard statistics: doctorId={}, startDate={}, endDate={}",
                    doctorId, today, endDate);

            Object[] stats = appointmentRepository.getDashboardStats(
                    doctorId, today, endDate);

            if (stats != null && stats.length >= 2) {
                totalAppointmentsInWindow = stats[0] != null
                        ? ((Number) stats[0]).longValue()
                        : 0;

                completedAppointmentsInWindow = stats[1] != null
                        ? ((Number) stats[1]).longValue()
                        : 0;

                logger.debug(
                        "Doctor dashboard statistics retrieved: doctorId={}, totalInWindow={}, completedInWindow={}",
                        doctorId,
                        totalAppointmentsInWindow,
                        completedAppointmentsInWindow);
            } else {
                logger.warn(
                        "Dashboard statistics returned null or incomplete data: doctorId={}",
                        doctorId);
            }

        } catch (Exception e) {
            logger.error(
                    "Failed to fetch doctor dashboard statistics: userId={}, doctorId={}",
                    userId, doctorId, e);
        }

        List<NextAppointmentDTO> nextAppointments;

        try {
            logger.debug(
                    "Fetching next two pending appointments: doctorId={}, date={}",
                    doctorId, today);

            nextAppointments = appointmentRepository
                    .findTop2ByDoctorIdAndAppointmentDateAndStatusOrderByQueueNumberAsc(
                            doctorId,
                            today,
                            AppointmentStatus.PENDING)
                    .stream()
                    .map(appointment -> {
                        NextAppointmentDTO dto = new NextAppointmentDTO();
                        dto.setPatientName(
                                appointment.getPatient().getName());
                        dto.setTime(appointment.getAppointmentTime());
                        return dto;
                    })
                    .collect(Collectors.toList());

            logger.debug(
                    "Next appointments retrieved: doctorId={}, count={}",
                    doctorId, nextAppointments.size());

        } catch (Exception e) {
            logger.error(
                    "Failed to fetch next appointments: userId={}, doctorId={}",
                    userId, doctorId, e);

            nextAppointments = List.of();
        }

        DoctorDashboardDTO dto = new DoctorDashboardDTO();
        dto.setDoctorId(doctor.getId());
        dto.setDoctorName(doctor.getName());
        dto.setTotalPatients(totalPatients);
        dto.setTodayAppointments(todayAppointments);
        dto.setCompletedAppointments(completedAppointments);
        dto.setNextAppointments(nextAppointments);
        dto.setTotalAppointmentsInWindow(totalAppointmentsInWindow);
        dto.setCompletedAppointmentsInWindow(completedAppointmentsInWindow);

        logger.info(
                "Doctor dashboard assembled successfully: userId={}, doctorId={}, totalPatients={}, todayAppointments={}, completedAppointments={}",
                userId,
                doctorId,
                totalPatients,
                todayAppointments,
                completedAppointments);

        return dto;
    }

    @Override
    public PatientDashboardDTO getPatientDashboard(Long userId) {

        logger.info("Fetching patient dashboard for userId={}", userId);

        Patient patient = resolvePatient(userId);
        Long patientId = patient.getId();

        logger.debug(
                "Resolved patient profile: userId={}, patientId={}, patientName={}",
                userId, patientId, patient.getName());

        long totalAppointments = safeCount(
                "countByPatientId",
                () -> appointmentRepository.countByPatientId(patientId));

        long totalPrescriptions = safeCount(
                "countByPatientId",
                () -> prescriptionRepository.countByPatientId(patientId));

        List<UpcomingAppointmentDTO> upcomingAppointments;

        try {
            logger.debug(
                    "Fetching upcoming pending appointments: patientId={}",
                    patientId);

            upcomingAppointments = appointmentRepository
                    .findTop3ByPatientIdAndAppointmentDateAfterAndStatusOrderByAppointmentDateAsc(
                            patientId,
                            LocalDate.now(),
                            AppointmentStatus.PENDING)
                    .stream()
                    .map(appointment -> {
                        UpcomingAppointmentDTO dto =
                                new UpcomingAppointmentDTO();

                        dto.setDoctorName(
                                appointment.getDoctor().getName());
                        dto.setDate(appointment.getAppointmentDate());
                        dto.setTime(appointment.getAppointmentTime());

                        return dto;
                    })
                    .collect(Collectors.toList());

            logger.debug(
                    "Upcoming appointments retrieved: patientId={}, count={}",
                    patientId, upcomingAppointments.size());

        } catch (Exception e) {
            logger.error(
                    "Failed to fetch upcoming appointments: userId={}, patientId={}",
                    userId, patientId, e);

            upcomingAppointments = List.of();
        }

        PatientDashboardDTO dto = new PatientDashboardDTO();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getName());
        dto.setTotalAppointments(totalAppointments);
        dto.setTotalPrescriptions(totalPrescriptions);
        dto.setUpcomingAppointments(upcomingAppointments);

        logger.info(
                "Patient dashboard assembled successfully: userId={}, patientId={}, totalAppointments={}, totalPrescriptions={}, upcomingAppointments={}",
                userId,
                patientId,
                totalAppointments,
                totalPrescriptions,
                upcomingAppointments.size());

        return dto;
    }

    private Doctor resolveDoctor(Long userId) {

        logger.debug("Resolving doctor profile for userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error(
                            "User not found while resolving doctor profile: userId={}",
                            userId);

                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();

        if (doctor == null) {
            logger.error(
                    "DOCTOR PROFILE NULL in DashboardServiceImpl.resolveDoctor(): userId={}, role={}",
                    userId, user.getRole());

            throw new AccessDeniedException("Not a doctor");
        }

        logger.debug(
                "Doctor profile resolved successfully: userId={}, doctorId={}",
                userId, doctor.getId());

        return doctor;
    }

    private Patient resolvePatient(Long userId) {

        logger.debug("Resolving patient profile for userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error(
                            "User not found while resolving patient profile: userId={}",
                            userId);

                    return new ResourceNotFoundException("User not found");
                });

        Patient patient = user.getPatient();

        if (patient == null) {
            logger.error(
                    "PATIENT PROFILE NULL in DashboardServiceImpl.resolvePatient(): userId={}, role={}",
                    userId, user.getRole());

            throw new AccessDeniedException("Not a patient");
        }

        logger.debug(
                "Patient profile resolved successfully: userId={}, patientId={}",
                userId, patient.getId());

        return patient;
    }

    private long safeCount(String queryName, Supplier<Long> supplier) {

        try {
            long result = supplier.get();

            logger.debug(
                    "Dashboard count query completed: query={}, result={}",
                    queryName, result);

            return result;

        } catch (Exception e) {
            logger.error(
                    "Error executing dashboard count query: query={}",
                    queryName, e);

            return 0;
        }
    }
}