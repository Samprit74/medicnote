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

        @Override
        @Transactional
        public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO request, Long patientId) {

                logger.info("Booking appointment for doctor {} and patient {}", request.getDoctorId(), patientId);

                LocalDate today = LocalDate.now();
                LocalDate endDate = today.plusWeeks(2);

                LocalDate selectedDate = request.getAppointmentDate();

                logger.debug("Validating appointment date {}", selectedDate);

                if (selectedDate.isBefore(today)) {
                        throw new IllegalArgumentException("Cannot book past dates");
                }

                if (selectedDate.isAfter(endDate)) {
                        throw new IllegalArgumentException("Booking allowed only within next 2 weeks");
                }

                if (selectedDate.getDayOfWeek().getValue() > 5) {
                        throw new IllegalArgumentException("Doctor not available on weekends");
                }

                Doctor doctor = doctorRepository.findById(request.getDoctorId())
                                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

                logger.info("Doctor found: {}", doctor.getEmail());

                CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                Patient patient = patientRepository.findByEmail(user.getUsername())
                                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

                logger.info("Patient found: {}", patient.getEmail());

                List<Appointment> lockedAppointments = appointmentRepository.findByDoctorIdAndDateForUpdate(
                                doctor.getId(),
                                selectedDate);

                logger.debug("Existing appointments count: {}", lockedAppointments.size());

                boolean alreadyBooked = lockedAppointments.stream()
                                .anyMatch(a -> a.getPatient().getId().equals(patient.getId()) &&
                                                a.getStatus() != AppointmentStatus.CANCELLED);

                if (alreadyBooked) {
                        throw new IllegalArgumentException(
                                        "You already have an appointment with this doctor on this date");
                }

                long count = lockedAppointments.stream()
                                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                                .count();

                if (count >= 10) {
                        throw new IllegalArgumentException("Selected date is full");
                }

                int queue = (int) count + 1;

                LocalTime time = LocalTime.of(9, 0)
                                .plusMinutes((queue - 1) * 30);

                Appointment appointment = new Appointment();
                appointment.setDoctor(doctor);
                appointment.setPatient(patient);
                appointment.setAppointmentDate(selectedDate);
                appointment.setAppointmentTime(time);
                appointment.setQueueNumber(queue);
                appointment.setStatus(AppointmentStatus.PENDING);

                logger.info("Saving appointment with queue {}", queue);

                try {
                        return appointmentMapper.toDTO(appointmentRepository.save(appointment));
                } catch (Exception ex) {
                        logger.error("Error while saving appointment", ex);
                        throw new IllegalArgumentException("Slot already booked, please try again");
                }
        }

        @Override
        public List<AppointmentResponseDTO> getDoctorQueue(Long doctorId) {

                logger.info("Fetching today's queue for doctor {}", doctorId);

                return appointmentRepository
                                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                                                doctorId,
                                                LocalDate.now())
                                .stream()
                                .map(appointmentMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId) {

                logger.info("Fetching all appointments for doctor {}", doctorId);

                return appointmentRepository.findByDoctorId(doctorId)
                                .stream()
                                .map(appointmentMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId) {

                CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                Patient patient = patientRepository.findByEmail(user.getUsername())
                                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

                logger.info("Fetching appointments for patient {}", patient.getEmail());

                return appointmentRepository.findByPatientId(patient.getId())
                                .stream()
                                .map(appointmentMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<AppointmentResponseDTO> getPatientHistory(Long patientId) {

                CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                Patient patient = patientRepository.findByEmail(user.getUsername())
                                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

                logger.info("Fetching appointment history for patient {}", patient.getEmail());

                return appointmentRepository
                                .findByPatientIdAndAppointmentDateBefore(patient.getId(), LocalDate.now())
                                .stream()
                                .map(appointmentMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public AppointmentResponseDTO updateStatus(Long appointmentId, String status, Long doctorId) {

                logger.info("Updating status of appointment {} to {}", appointmentId, status);

                Appointment appointment = appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

                CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                boolean isAdmin = user.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

                if (!isAdmin && !appointment.getDoctor().getId().equals(doctorId)) {
                        throw new AccessDeniedException("Not allowed");
                }

                try {
                        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
                } catch (Exception e) {
                        throw new IllegalArgumentException("Invalid status value");
                }

                return appointmentMapper.toDTO(appointmentRepository.save(appointment));
        }

        @Override
        @Transactional
        public void cancelAppointment(Long appointmentId, Long patientId) {

                logger.info("Cancelling appointment {}", appointmentId);

                Appointment appointment = appointmentRepository.findById(appointmentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

                CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                boolean isAdmin = user.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

                if (!isAdmin && !appointment.getPatient().getEmail().equals(user.getUsername())) {
                        throw new AccessDeniedException("Not allowed");
                }

                if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
                        return;
                }

                appointment.setStatus(AppointmentStatus.CANCELLED);
                appointmentRepository.save(appointment);

                List<Appointment> appointments = appointmentRepository
                                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                                                appointment.getDoctor().getId(),
                                                appointment.getAppointmentDate());

                int queue = 1;

                for (Appointment appt : appointments) {

                        if (appt.getStatus() == AppointmentStatus.CANCELLED)
                                continue;

                        appt.setQueueNumber(queue);

                        LocalTime time = LocalTime.of(9, 0)
                                        .plusMinutes((queue - 1) * 30);

                        appt.setAppointmentTime(time);

                        appointmentRepository.save(appt);

                        queue++;
                }
        }

        @Override
        public List<AvailabilityResponseDTO> getAvailability(Long doctorId) {

                logger.info("Fetching availability for doctor {}", doctorId);

                Doctor doctor = doctorRepository.findById(doctorId)
                                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

                List<AvailabilityResponseDTO> result = new ArrayList<>();

                LocalDate today = LocalDate.now();
                LocalDate endDate = today.plusWeeks(2);

                LocalDate current = today;

                while (!current.isAfter(endDate)) {

                        if (current.getDayOfWeek().getValue() <= 5) {

                                long count = appointmentRepository
                                                .countByDoctorIdAndAppointmentDateAndStatusNot(
                                                                doctor.getId(),
                                                                current,
                                                                AppointmentStatus.CANCELLED);

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
}