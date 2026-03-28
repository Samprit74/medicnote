package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
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

        long totalPatients = appointmentRepository.countDistinctPatientIdByDoctor_Id(doctorId);

        long todayAppointments = appointmentRepository
                .countByDoctorIdAndAppointmentDateAndStatusNot(
                        doctorId,
                        today,
                        AppointmentStatus.CANCELLED
                );

        long completedAppointments = appointmentRepository
                .countByDoctorIdAndAppointmentDateAndStatus(
                        doctorId,
                        today,
                        AppointmentStatus.COMPLETED
                );

        List<NextAppointmentDTO> nextAppointments = appointmentRepository
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

        long totalAppointments = appointmentRepository.countByPatientId(patientId);

        long totalPrescriptions = prescriptionRepository
                .findByPatientIdOrderByDateDesc(patientId, PageRequest.of(0, 1))
                .getTotalElements();

        List<UpcomingAppointmentDTO> upcomingAppointments = appointmentRepository
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

        PatientDashboardDTO dto = new PatientDashboardDTO();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getName());
        dto.setTotalAppointments(totalAppointments);
        dto.setTotalPrescriptions(totalPrescriptions);
        dto.setUpcomingAppointments(upcomingAppointments);

        return dto;
    }
}