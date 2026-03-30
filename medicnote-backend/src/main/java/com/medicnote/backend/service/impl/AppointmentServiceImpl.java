package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.AppointmentRequestDTO;
import com.medicnote.backend.dto.response.AppointmentResponseDTO;
import com.medicnote.backend.dto.response.AvailabilityResponseDTO;
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
import com.medicnote.backend.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

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

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long patientId) {

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);
        LocalDate selectedDate = request.getAppointmentDate();

        validateDate(selectedDate, today, endDate);

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

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

        return appointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getDoctorQueue(Long doctorId) {
        return appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(doctorId, LocalDate.now())
                .stream()
                .map(appointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId, int page, int size) {
        return appointmentRepository.findByDoctorId(doctorId, PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public Page<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId, int page, int size) {
        return appointmentRepository.findByPatientId(patientId, PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public Page<AppointmentResponseDTO> getPatientHistory(Long patientId, int page, int size) {
        return appointmentRepository
                .findByPatientIdAndAppointmentDateBefore(
                        patientId,
                        LocalDate.now(),
                        PageRequest.of(page, size))
                .map(appointmentMapper::toDTO);
    }

    @Override
    public AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long doctorId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AccessDeniedException("Not allowed");
        }

        appointment.setStatus(parseStatus(status));

        return appointmentMapper.toDTO(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getPatient().getId().equals(patientId)) {
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
            if (appt.getStatus() == AppointmentStatus.CANCELLED) continue;

            appt.setQueueNumber(queue);
            appt.setAppointmentTime(calculateTime(queue));
            queue++;
        }

        appointmentRepository.saveAll(appointments);
    }

    @Override
    public List<AvailabilityResponseDTO> getAvailability(Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(2);

        List<Object[]> data = appointmentRepository
                .countAppointmentsGroupedByDate(doctorId, today, endDate);

        Map<LocalDate, Long> countMap = data.stream()
                .collect(Collectors.toMap(
                        row -> (LocalDate) row[0],
                        row -> (Long) row[1]
                ));

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