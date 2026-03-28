package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
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

        long totalPatients = appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .count();

        long todayAppointments = appointmentRepository
                .countByDoctorIdAndAppointmentDateAndStatusNot(doctorId, today, AppointmentStatus.CANCELLED);

        long completedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateAndStatus(
                        doctorId,
                        today,
                        AppointmentStatus.COMPLETED
                ).size();

        List<NextAppointmentDTO> nextAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(doctorId, today)
                .stream()
                .filter(a -> a.getStatus() == AppointmentStatus.PENDING)
                .limit(2)
                .map(a -> {
                    NextAppointmentDTO dto = new NextAppointmentDTO();
                    dto.setPatientName(a.getPatient().getName());
                    dto.setTime(a.getAppointmentTime());
                    return dto;
                })
                .collect(Collectors.toList());

        DoctorDashboardDTO dto = new DoctorDashboardDTO();
        dto.setDoctorId(doctor.getId());
        dto.setDoctorName(doctor.getName());
        dto.setTotalPatients(totalPatients);
        dto.setTodayAppointments(todayAppointments);
        dto.setCompletedAppointments(completedAppointments);
        dto.setNextAppointments(nextAppointments);

        return dto;
    }

    @Override
    public PatientDashboardDTO getPatientDashboard(Long patientId) {

        logger.info("Fetching dashboard for patient {}", patientId);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        long totalAppointments = appointmentRepository.findByPatientId(patientId).size();

        long totalPrescriptions = prescriptionRepository
                .findByPatientIdOrderByDateDesc(patientId)
                .size();

        List<UpcomingAppointmentDTO> upcomingAppointments = appointmentRepository
                .findByPatientId(patientId)
                .stream()
                .filter(a -> a.getAppointmentDate().isAfter(LocalDate.now())
                        && a.getStatus() == AppointmentStatus.PENDING)
                .sorted((a, b) -> a.getAppointmentDate().compareTo(b.getAppointmentDate()))
                .limit(3)
                .map(a -> {
                    UpcomingAppointmentDTO dto = new UpcomingAppointmentDTO();
                    dto.setDoctorName(a.getDoctor().getName());
                    dto.setDate(a.getAppointmentDate());
                    dto.setTime(a.getAppointmentTime());
                    return dto;
                })
                .collect(Collectors.toList());

        PatientDashboardDTO dto = new PatientDashboardDTO();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getName());
        dto.setTotalAppointments(totalAppointments);
        dto.setTotalPrescriptions(totalPrescriptions);
        dto.setUpcomingAppointments(upcomingAppointments);

        return dto;
    }
}