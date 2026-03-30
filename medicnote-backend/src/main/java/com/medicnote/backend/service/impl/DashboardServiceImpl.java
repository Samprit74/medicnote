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
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    public DashboardServiceImpl(DoctorRepository doctorRepository,
                               PatientRepository patientRepository,
                               AppointmentRepository appointmentRepository,
                               PrescriptionRepository prescriptionRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Override
    public DoctorDashboardDTO getDoctorDashboard(Long doctorId) {

        logger.info("Fetching dashboard for doctor {}", doctorId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);

        long totalPatients = safeCount(() ->
                appointmentRepository.countDistinctPatientIdByDoctor_Id(doctorId)
        );

        long todayAppointments = safeCount(() ->
                appointmentRepository.countByDoctorIdAndAppointmentDateAndStatusNot(
                        doctorId,
                        today,
                        AppointmentStatus.CANCELLED
                )
        );

        long completedAppointments = safeCount(() ->
                appointmentRepository.countByDoctorIdAndAppointmentDateAndStatus(
                        doctorId,
                        today,
                        AppointmentStatus.COMPLETED
                )
        );

        long totalAppointmentsInWindow = 0;
        long completedAppointmentsInWindow = 0;

        try {
            Object[] stats = appointmentRepository.getDashboardStats(doctorId, today, endDate);

            if (stats != null) {
                totalAppointmentsInWindow = ((Number) stats[0]).longValue();
                completedAppointmentsInWindow = stats[1] != null
                        ? ((Number) stats[1]).longValue()
                        : 0;
            }
        } catch (Exception e) {
            logger.error("Error fetching dashboard stats", e);
        }

        List<NextAppointmentDTO> nextAppointments;

        try {
            nextAppointments = appointmentRepository
                    .findTop2ByDoctorIdAndAppointmentDateAndStatusOrderByQueueNumberAsc(
                            doctorId,
                            today,
                            AppointmentStatus.PENDING
                    )
                    .stream()
                    .map(a -> {
                        NextAppointmentDTO dto = new NextAppointmentDTO();
                        dto.setPatientName(a.getPatient().getName());
                        dto.setTime(a.getAppointmentTime());
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to fetch next appointments", e);
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

        return dto;
    }

    @Override
    public PatientDashboardDTO getPatientDashboard(Long patientId) {

        logger.info("Fetching dashboard for patient {}", patientId);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        long totalAppointments = safeCount(() ->
                appointmentRepository.countByPatientId(patientId)
        );

        long totalPrescriptions = safeCount(() ->
                prescriptionRepository.countByPatientId(patientId)
        );

        List<UpcomingAppointmentDTO> upcomingAppointments;

        try {
            upcomingAppointments = appointmentRepository
                    .findTop3ByPatientIdAndAppointmentDateAfterAndStatusOrderByAppointmentDateAsc(
                            patientId,
                            LocalDate.now(),
                            AppointmentStatus.PENDING
                    )
                    .stream()
                    .map(a -> {
                        UpcomingAppointmentDTO dto = new UpcomingAppointmentDTO();
                        dto.setDoctorName(a.getDoctor().getName());
                        dto.setDate(a.getAppointmentDate());
                        dto.setTime(a.getAppointmentTime());
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Failed to fetch upcoming appointments", e);
            upcomingAppointments = List.of();
        }

        PatientDashboardDTO dto = new PatientDashboardDTO();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getName());
        dto.setTotalAppointments(totalAppointments);
        dto.setTotalPrescriptions(totalPrescriptions);
        dto.setUpcomingAppointments(upcomingAppointments);

        return dto;
    }

    private long safeCount(Supplier<Long> supplier) {
        try {
            return supplier.get();
        } catch (Exception e) {
            logger.error("Error executing dashboard query", e);
            return 0;
        }
    }
}