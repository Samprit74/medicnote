package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.dto.response.AvailabilityResponseDTO;
import com.medicnote.backend.entity.*;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.IllegalArgumentException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.AppointmentMapper;
import com.medicnote.backend.repository.*;
import com.medicnote.backend.service.AppointmentService;
import com.medicnote.backend.service.EmailService;
import com.medicnote.backend.util.PdfGenerator;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentMapper appointmentMapper;
    private final PrescriptionRepository prescriptionRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentMapper appointmentMapper,
            PrescriptionRepository prescriptionRepository,
            EmailService emailService,
            UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentMapper = appointmentMapper;
        this.prescriptionRepository = prescriptionRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long userId) {

        logger.info("Booking appointment for user {} with doctor {}", userId, request.getDoctorId());

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);
        LocalDate selectedDate = request.getAppointmentDate();

        validateDate(selectedDate, today, endDate);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Patient patient = user.getPatient();
        if (patient == null) {
            logger.error("User {} is not a patient", userId);
            throw new AccessDeniedException("Not a patient");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> {
                    logger.error("Doctor not found: {}", request.getDoctorId());
                    return new ResourceNotFoundException("Doctor not found");
                });

        List<Appointment> lockedAppointments =
                appointmentRepository.findByDoctorIdAndDateForUpdate(doctor.getId(), selectedDate);

        validateDuplicateBooking(lockedAppointments, patient.getId());

        int queue = calculateQueue(lockedAppointments);
        LocalTime time = calculateTime(queue);

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(selectedDate);
        appointment.setAppointmentTime(time);
        appointment.setQueueNumber(queue);
        appointment.setStatus(AppointmentStatus.PENDING);

        logger.info("Appointment created with queue {} at {}", queue, time);

        return appointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getDoctorQueue(Long userId) {

        logger.info("Fetching doctor queue for user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();
        if (doctor == null) {
            logger.error("User {} is not a doctor", userId);
            throw new AccessDeniedException("Not a doctor");
        }

        return appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(doctor.getId(), LocalDate.now())
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AppointmentResponseDTO> getAppointmentsByDoctor(Long userId, int page, int size) {

        logger.info("Fetching appointments for doctor user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();
        if (doctor == null) {
            logger.error("User {} is not a doctor", userId);
            throw new AccessDeniedException("Not a doctor");
        }

        return appointmentRepository.findByDoctorId(doctor.getId(), PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public Page<AppointmentResponseDTO> getAppointmentsByPatient(Long userId, int page, int size) {

        logger.info("Fetching appointments for patient user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Patient patient = user.getPatient();
        if (patient == null) {
            logger.error("User {} is not a patient", userId);
            throw new AccessDeniedException("Not a patient");
        }

        return appointmentRepository.findByPatientId(patient.getId(), PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public Page<AppointmentResponseDTO> getPatientHistory(Long userId, int page, int size) {

        logger.info("Fetching appointment history for patient user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Patient patient = user.getPatient();
        if (patient == null) {
            logger.error("User {} is not a patient", userId);
            throw new AccessDeniedException("Not a patient");
        }

        return appointmentRepository
                .findByPatientIdAndAppointmentDateBefore(
                        patient.getId(),
                        LocalDate.now(),
                        PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long userId) {

        logger.info("Updating status for appointment {} by user {}", appointmentId, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Doctor doctor = user.getDoctor();
        if (doctor == null) {
            logger.error("User {} is not a doctor", userId);
            throw new AccessDeniedException("Not a doctor");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> {
                    logger.error("Appointment not found: {}", appointmentId);
                    return new ResourceNotFoundException("Appointment not found");
                });

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            logger.error("Doctor {} not allowed to update appointment {}", doctor.getId(), appointmentId);
            throw new AccessDeniedException("Not allowed");
        }

        AppointmentStatus newStatus = parseStatus(status);
        appointment.setStatus(newStatus);

        Appointment saved = appointmentRepository.save(appointment);

        if (newStatus == AppointmentStatus.COMPLETED) {
            logger.info("Appointment {} completed. Sending prescription email.", appointmentId);
            sendPrescriptionEmail(saved);
        }

        return appointmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long userId) {

        logger.info("Cancelling appointment {} by user {}", appointmentId, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Patient patient = user.getPatient();
        if (patient == null) {
            logger.error("User {} is not a patient", userId);
            throw new AccessDeniedException("Not a patient");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> {
                    logger.error("Appointment not found: {}", appointmentId);
                    return new ResourceNotFoundException("Appointment not found");
                });

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            logger.error("Patient {} not allowed to cancel appointment {}", patient.getId(), appointmentId);
            throw new AccessDeniedException("Not allowed");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            return;
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                        appointment.getDoctor().getId(),
                        appointment.getAppointmentDate());

        int queue = 1;

        for (Appointment appt : appointments) {
            if (appt.getStatus() == AppointmentStatus.CANCELLED)
                continue;

            appt.setQueueNumber(queue);
            appt.setAppointmentTime(calculateTime(queue));
            queue++;
        }

        appointmentRepository.saveAll(appointments);
    }

    @Override
    public List<AvailabilityResponseDTO> getAvailability(Long doctorId) {

        logger.info("Fetching availability for doctor {}", doctorId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> {
                    logger.error("Doctor not found: {}", doctorId);
                    return new ResourceNotFoundException("Doctor not found");
                });

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);

        List<Object[]> data = appointmentRepository
                .countAppointmentsGroupedByDate(doctorId, today, endDate);

        Map<LocalDate, Long> countMap = data.stream()
                .collect(Collectors.toMap(
                        row -> (LocalDate) row[0],
                        row -> (Long) row[1]));

        List<AvailabilityResponseDTO> result = new ArrayList<>();

        LocalDate current = today;

        while (!current.isAfter(endDate)) {

            if (current.getDayOfWeek().getValue() <= 5) {

                long count = countMap.getOrDefault(current, 0L);

                AvailabilityResponseDTO dto = new AvailabilityResponseDTO();
                dto.setDate(current);
                dto.setAvailableSlots((int) (10 - count));
                dto.setDoctorName(doctor.getName());

                result.add(dto);
            }

            current = current.plusDays(1);
        }

        return result;
    }

    private void sendPrescriptionEmail(Appointment appointment) {

        Prescription prescription = prescriptionRepository
                .findByAppointmentId(appointment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        byte[] pdf = PdfGenerator.generatePrescriptionPdf(prescription);

        String email = appointment.getPatient().getEmail();
        String name = appointment.getPatient().getName();

        emailService.sendPrescriptionEmail(email, name, pdf);
    }

    private void validateDate(LocalDate selectedDate, LocalDate today, LocalDate endDate) {

        if (selectedDate.isBefore(today)) {
            throw new IllegalArgumentException("Cannot book past dates");
        }

        if (selectedDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Booking allowed only within next 2 weeks");
        }

        if (selectedDate.getDayOfWeek().getValue() > 5) {
            throw new IllegalArgumentException("Doctor not available on weekends");
        }
    }

    private void validateDuplicateBooking(List<Appointment> appointments, Long patientId) {

        boolean exists = appointments.stream()
                .anyMatch(a -> a.getPatient().getId().equals(patientId)
                        && a.getStatus() != AppointmentStatus.CANCELLED);

        if (exists) {
            throw new IllegalArgumentException("Already booked for this date");
        }
    }

    private int calculateQueue(List<Appointment> appointments) {

        long count = appointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .count();

        if (count >= 10) {
            throw new IllegalArgumentException("Selected date is full");
        }

        return (int) count + 1;
    }

    private LocalTime calculateTime(int queue) {
        return LocalTime.of(9, 0).plusMinutes((queue - 1) * 30);
    }

    private AppointmentStatus parseStatus(String status) {
        try {
            return AppointmentStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status");
        }
    }
}