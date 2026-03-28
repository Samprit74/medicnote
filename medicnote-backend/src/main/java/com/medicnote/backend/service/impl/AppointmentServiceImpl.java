package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.AppointmentStatus;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.IllegalArgumentException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.AppointmentMapper;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.security.service.CustomUserDetails;
import com.medicnote.backend.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentMapper appointmentMapper;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository,
                                  AppointmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentMapper = appointmentMapper;
    }

    // =========================
    //  BOOK APPOINTMENT (THREAD SAFE)
    // =========================
    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long patientId) {

        logger.info("Booking appointment for doctor {} and patient {}", request.getDoctorId(), patientId);

        LocalDate today = LocalDate.now();
        LocalDate monday = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate friday = monday.plusDays(4);

        LocalDate selectedDate = request.getAppointmentDate();

        //  Prevent past booking
        if (selectedDate.isBefore(today)) {
            throw new IllegalArgumentException("Cannot book past dates");
        }

        //  Only current week weekdays
        if (selectedDate.isBefore(monday) || selectedDate.isAfter(friday)) {
            throw new IllegalArgumentException("Booking allowed only for current week's weekdays");
        }

        //  No weekends
        if (selectedDate.getDayOfWeek().getValue() > 5) {
            throw new IllegalArgumentException("Doctor not available on weekends");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        //  LOCK appointments (critical for concurrency)
        List<Appointment> lockedAppointments =
                appointmentRepository.findByDoctorIdAndDateForUpdate(
                        request.getDoctorId(),
                        selectedDate
                );

        //  Prevent duplicate booking (same doctor + same day)
        boolean alreadyBooked = lockedAppointments.stream()
                .anyMatch(a ->
                        a.getPatient().getId().equals(patientId) &&
                        a.getStatus() != AppointmentStatus.CANCELLED
                );

        if (alreadyBooked) {
            throw new IllegalArgumentException(
                    "You already have an appointment with this doctor on this date");
        }

        //  Count valid appointments
        long count = lockedAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .count();

        if (count >= 10) {
            throw new IllegalArgumentException("Selected date is full");
        }

        int queue = (int) count + 1;

        //  Auto-generate time (9 AM + 30 mins per slot)
        LocalTime time = LocalTime.of(9, 0)
                .plusMinutes((queue - 1) * 30);

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(selectedDate);
        appointment.setAppointmentTime(time);
        appointment.setQueueNumber(queue);
        appointment.setStatus(AppointmentStatus.PENDING);

        //  HANDLE DB UNIQUE CONSTRAINT FAILURE
        try {
            return appointmentMapper.toDTO(appointmentRepository.save(appointment));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Slot already booked, please try again");
        }
    }

    // =========================
    // DOCTOR QUEUE
    // =========================
    @Override
    public List<AppointmentResponseDTO> getDoctorQueue(Long doctorId) {

        return appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                        doctorId,
                        LocalDate.now()
                )
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // DOCTOR APPOINTMENTS
    // =========================
    @Override
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {

        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // PATIENT APPOINTMENTS
    // =========================
    @Override
    public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId) {

        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // PATIENT HISTORY
    // =========================
    @Override
    public List<AppointmentResponseDTO> getPatientHistory(Long patientId) {

        return appointmentRepository
                .findByPatientIdAndAppointmentDateBefore(patientId, LocalDate.now())
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // UPDATE STATUS
    // =========================
    @Override
    public AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long doctorId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        CustomUserDetails user =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !appointment.getDoctor().getId().equals(doctorId)) {
            throw new AccessDeniedException("Not allowed");
        }

        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));

        return appointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    // =========================
    // CANCEL + REORDER
    // =========================
    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        CustomUserDetails user =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !appointment.getPatient().getId().equals(patientId)) {
            throw new AccessDeniedException("Not allowed");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        List<Appointment> appointments =
                appointmentRepository.findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                        appointment.getDoctor().getId(),
                        appointment.getAppointmentDate()
                );

        int queue = 1;

        for (Appointment appt : appointments) {

            if (appt.getStatus() == AppointmentStatus.CANCELLED) continue;

            appt.setQueueNumber(queue);

            LocalTime time = LocalTime.of(9, 0)
                    .plusMinutes((queue - 1) * 30);

            appt.setAppointmentTime(time);

            appointmentRepository.save(appt);

            queue++;
        }
    }

    // =========================
    // AVAILABILITY
    // =========================
    @Override
    public List<AppointmentResponseDTO> getAvailability(Long doctorId) {

        List<AppointmentResponseDTO> result = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate monday = today.minusDays(today.getDayOfWeek().getValue() - 1);

        for (int i = 0; i < 5; i++) {

            LocalDate date = monday.plusDays(i);

            long count = appointmentRepository
                    .countByDoctorIdAndAppointmentDateAndStatusNot(
                            doctorId,
                            date,
                            AppointmentStatus.CANCELLED
                    );

            Appointment temp = new Appointment();
            temp.setAppointmentDate(date);
            temp.setQueueNumber((int) (10 - count));

            result.add(appointmentMapper.toDTO(temp));
        }

        return result;
    }
}