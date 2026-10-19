package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.AppointmentStatus;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.exception.AccessDeniedException;
import com.medicnote.backend.exception.IllegalArgumentException;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.PrescriptionMapper;
import com.medicnote.backend.repository.AppointmentRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.repository.UserRepository;
import com.medicnote.backend.service.PrescriptionService;
import com.medicnote.backend.util.PdfGenerator;

@Service
@Transactional(readOnly = true)
public class PrescriptionServiceImpl implements PrescriptionService {

    private static final Logger logger =
            LoggerFactory.getLogger(PrescriptionServiceImpl.class);

    private final PrescriptionRepository repository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionMapper mapper;
    private final UserRepository userRepository;

    public PrescriptionServiceImpl(
            PrescriptionRepository repository,
            AppointmentRepository appointmentRepository,
            PrescriptionMapper mapper,
            UserRepository userRepository) {

        this.repository = repository;
        this.appointmentRepository = appointmentRepository;
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO create(
            PrescriptionRequestDTO request,
            Long userId) {

        logger.info(
                "Creating/updating prescription for user {}",
                userId);

        Doctor doctor = resolveDoctor(userId);

        Appointment appointment = appointmentRepository
                .findById(request.getAppointmentId())
                .orElseThrow(() -> {
                    logger.error(
                            "Appointment not found: {}",
                            request.getAppointmentId());

                    return new ResourceNotFoundException(
                            "Appointment not found");
                });

        validateDoctor(appointment, doctor.getId());
        validateAppointmentNotCompleted(appointment);

        Prescription existing = repository
                .findByAppointmentId(appointment.getId())
                .orElse(null);

        if (existing != null) {
            logger.info(
                    "Updating existing prescription for appointment {}",
                    appointment.getId());

            applyPrescriptionUpdate(existing, request);

            Prescription savedPrescription =
                    repository.save(existing);

            logger.info(
                    "Prescription {} updated successfully for appointment {}",
                    savedPrescription.getId(),
                    appointment.getId());

            return mapper.toDTO(savedPrescription);
        }

        Prescription prescription =
                buildPrescription(appointment, request);

        Prescription savedPrescription =
                repository.save(prescription);

        logger.info(
                "Prescription {} created successfully for appointment {}",
                savedPrescription.getId(),
                appointment.getId());

        return mapper.toDTO(savedPrescription);
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO createUsingAppointment(
            Long appointmentId,
            PrescriptionRequestDTO request,
            Long userId) {

        logger.info(
                "Creating/updating prescription using appointment {} by user {}",
                appointmentId,
                userId);

        Doctor doctor = resolveDoctor(userId);

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> {
                    logger.error(
                            "Appointment not found: {}",
                            appointmentId);

                    return new ResourceNotFoundException(
                            "Appointment not found");
                });

        validateDoctor(appointment, doctor.getId());
        validateAppointmentNotCompleted(appointment);

        Prescription existing = repository
                .findByAppointmentId(appointmentId)
                .orElse(null);

        if (existing != null) {
            logger.info(
                    "Updating existing prescription for appointment {}",
                    appointmentId);

            applyPrescriptionUpdate(existing, request);

            Prescription savedPrescription =
                    repository.save(existing);

            logger.info(
                    "Prescription {} updated successfully for appointment {}",
                    savedPrescription.getId(),
                    appointmentId);

            return mapper.toDTO(savedPrescription);
        }

        Prescription prescription =
                buildPrescription(appointment, request);

        Prescription savedPrescription =
                repository.save(prescription);

        logger.info(
                "Prescription {} created successfully for appointment {}",
                savedPrescription.getId(),
                appointmentId);

        return mapper.toDTO(savedPrescription);
    }

    private void applyPrescriptionUpdate(
            Prescription existing,
            PrescriptionRequestDTO request) {

        logger.info(
                "Applying prescription update to prescription {}",
                existing.getId());

        existing.setDiagnosis(request.getDiagnosis());
        existing.setNotes(request.getNotes());

        existing.getItems().clear();

        Optional.ofNullable(request.getItems())
                .orElse(List.of())
                .forEach(itemRequest -> {
                    PrescriptionItem item = new PrescriptionItem();

                    item.setMedicineName(
                            itemRequest.getMedicineName());
                    item.setDosage(itemRequest.getDosage());
                    item.setFrequency(itemRequest.getFrequency());
                    item.setDuration(itemRequest.getDuration());

                    existing.addItem(item);
                });
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO createUsingEmail(
            PrescriptionByEmailRequestDTO request,
            Long userId) {

        logger.info(
                "Creating/updating email-based prescription for user {}",
                userId);

        Doctor doctor = resolveDoctor(userId);
        Long actualDoctorId = doctor.getId();

        String patientEmail = request.getPatientEmail();

        if (patientEmail == null || patientEmail.isBlank()) {
            logger.warn(
                    "Prescription creation rejected because patient email is missing");

            throw new IllegalArgumentException(
                    "Patient email is required");
        }

        patientEmail = patientEmail.trim();

        LocalDate today = LocalDate.now();

        logger.info(
                "Searching today's appointments for doctor {} and patient email {}",
                actualDoctorId,
                patientEmail);

        List<Appointment> appointments =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(
                                actualDoctorId,
                                today);

        final String emailToMatch = patientEmail;

        List<Appointment> matchingAppointments =
                appointments.stream()
                        .filter(appointment ->
                                appointment.getPatient() != null
                                        && appointment.getPatient().getEmail() != null
                                        && appointment.getPatient()
                                        .getEmail()
                                        .equalsIgnoreCase(emailToMatch)
                                        && appointment.getStatus()
                                        != AppointmentStatus.CANCELLED)
                        .toList();

        if (matchingAppointments.isEmpty()) {
            logger.warn(
                    "No appointment found for doctor {} and patient email {} on {}",
                    actualDoctorId,
                    patientEmail,
                    today);

            throw new ResourceNotFoundException(
                    "No appointment found for this patient and doctor today");
        }

        if (matchingAppointments.size() > 1) {
            logger.warn(
                    "Multiple appointments found for doctor {} and patient email {} on {}",
                    actualDoctorId,
                    patientEmail,
                    today);

            throw new IllegalArgumentException(
                    "Multiple appointments found for this patient today; "
                            + "the appointment cannot be resolved unambiguously");
        }

        Appointment appointment = matchingAppointments.get(0);

        validateDoctor(appointment, actualDoctorId);
        validateAppointmentNotCompleted(appointment);

        Long patientId = appointment.getPatient().getId();

        logger.info(
                "Resolved appointment {} for doctor {} and patient {}",
                appointment.getId(),
                actualDoctorId,
                patientId);

        Prescription existingPrescription = repository
                .findByAppointmentId(appointment.getId())
                .orElse(null);

        Prescription prescription;

        if (existingPrescription != null) {
            logger.info(
                    "Updating existing prescription {} for appointment {}",
                    existingPrescription.getId(),
                    appointment.getId());

            applyEmailPrescriptionUpdate(
                    existingPrescription,
                    request);

            prescription = existingPrescription;
        } else {
            logger.info(
                    "Creating new prescription for appointment {}",
                    appointment.getId());

            prescription =
                    buildPrescriptionFromEmail(appointment, request);
        }

        Prescription savedPrescription =
                repository.saveAndFlush(prescription);

        logger.info(
                "Prescription {} saved for appointment {}",
                savedPrescription.getId(),
                appointment.getId());

        return mapper.toDTO(savedPrescription);
    }

    private void applyEmailPrescriptionUpdate(
            Prescription existing,
            PrescriptionByEmailRequestDTO request) {

        logger.info(
                "Applying email-based update to prescription {}",
                existing.getId());

        existing.setDiagnosis(request.getDiagnosis());
        existing.setNotes(request.getNotes());

        existing.getItems().clear();

        Optional.ofNullable(request.getItems())
                .orElse(List.of())
                .forEach(itemRequest -> {
                    PrescriptionItem item = new PrescriptionItem();

                    item.setMedicineName(
                            itemRequest.getMedicineName());
                    item.setDosage(itemRequest.getDosage());
                    item.setFrequency(itemRequest.getFrequency());
                    item.setDuration(itemRequest.getDuration());

                    existing.addItem(item);
                });
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatient(
            Long userId,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for patient user {}, page {}, size {}",
                userId,
                page,
                size);

        Patient patient = resolvePatient(userId);

        return repository
                .findByPatientIdOrderByDateDesc(
                        patient.getId(),
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDate(
            Long userId,
            LocalDate date,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for patient user {} on date {}",
                userId,
                date);

        Patient patient = resolvePatient(userId);

        return repository
                .findByPatientIdAndDate(
                        patient.getId(),
                        date,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDoctor(
            Long userId,
            String doctorName,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for patient user {} and doctor {}",
                userId,
                doctorName);

        Patient patient = resolvePatient(userId);

        return repository
                .findByPatientIdAndDoctorNameContainingIgnoreCase(
                        patient.getId(),
                        doctorName,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDateRange(
            Long userId,
            String start,
            String end,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for patient user {} between {} and {}",
                userId,
                start,
                end);

        Patient patient = resolvePatient(userId);

        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        if (startDate.isAfter(endDate)) {
            logger.warn(
                    "Invalid prescription date range: {} is after {}",
                    startDate,
                    endDate);

            throw new IllegalArgumentException(
                    "Start date must not be after end date");
        }

        return repository
                .findByPatientIdAndDateBetweenOrderByDateDesc(
                        patient.getId(),
                        startDate,
                        endDate,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(
            Long doctorId,
            Long patientId,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for doctor {} and patient {}",
                doctorId,
                patientId);

        return repository
                .findByDoctorIdAndPatientIdOrderByDateDesc(
                        doctorId,
                        patientId,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getDoctorPrescriptionsByDate(
            Long doctorId,
            LocalDate date,
            int page,
            int size) {

        logger.info(
                "Fetching prescriptions for doctor {} on date {}",
                doctorId,
                date);

        return repository
                .findByDoctorIdAndDate(
                        doctorId,
                        date,
                        PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public PrescriptionResponseDTO getById(Long id) {

        logger.info("Fetching prescription with ID {}", id);

        Prescription prescription = repository
                .findWithDetailsById(id)
                .orElseThrow(() -> {
                    logger.error(
                            "Prescription not found: {}",
                            id);

                    return new ResourceNotFoundException(
                            "Prescription not found");
                });

        return mapper.toDTO(prescription);
    }

    @Override
    public byte[] generatePdf(Long id) {

        logger.info(
                "Generating PDF for prescription {}",
                id);

        Prescription prescription = repository
                .findWithDetailsById(id)
                .orElseThrow(() -> {
                    logger.error(
                            "Prescription not found: {}",
                            id);

                    return new ResourceNotFoundException(
                            "Prescription not found");
                });

        byte[] pdf =
                PdfGenerator.generatePrescriptionPdf(prescription);

        logger.info(
                "PDF generated successfully for prescription {}",
                id);

        return pdf;
    }

    private Doctor resolveDoctor(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);

                    return new ResourceNotFoundException(
                            "User not found");
                });

        Doctor doctor = user.getDoctor();

        if (doctor == null) {
            logger.warn(
                    "User {} is not associated with a doctor profile",
                    userId);

            throw new AccessDeniedException("Not a doctor");
        }

        return doctor;
    }

    private Patient resolvePatient(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", userId);

                    return new ResourceNotFoundException(
                            "User not found");
                });

        Patient patient = user.getPatient();

        if (patient == null) {
            logger.warn(
                    "User {} is not associated with a patient profile",
                    userId);

            throw new AccessDeniedException("Not a patient");
        }

        return patient;
    }

    private void validateDoctor(
            Appointment appointment,
            Long doctorId) {

        if (appointment.getDoctor() == null
                || !appointment.getDoctor().getId().equals(doctorId)) {

            logger.warn(
                    "Doctor {} is not allowed to access appointment {}",
                    doctorId,
                    appointment.getId());

            throw new AccessDeniedException("Not allowed");
        }
    }

    /**
     * Prevent prescription creation or modification after an appointment
     * has been completed. The completion workflow can still create its
     * fallback prescription directly through the repository.
     */
    private void validateAppointmentNotCompleted(
            Appointment appointment) {

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            logger.warn(
                    "Prescription write rejected because appointment {} is completed",
                    appointment.getId());

            throw new IllegalArgumentException(
                    "Cannot create or modify a prescription "
                            + "for a completed appointment");
        }
    }

    private Prescription buildPrescription(
            Appointment appointment,
            PrescriptionRequestDTO request) {

        logger.info(
                "Building prescription for appointment {}",
                appointment.getId());

        Prescription prescription = new Prescription();

        prescription.setAppointment(appointment);
        prescription.setDoctor(appointment.getDoctor());
        prescription.setPatient(appointment.getPatient());
        prescription.setDate(appointment.getAppointmentDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        Optional.ofNullable(request.getItems())
                .orElse(List.of())
                .forEach(itemRequest -> {
                    PrescriptionItem item = new PrescriptionItem();

                    item.setMedicineName(
                            itemRequest.getMedicineName());
                    item.setDosage(itemRequest.getDosage());
                    item.setFrequency(itemRequest.getFrequency());
                    item.setDuration(itemRequest.getDuration());

                    prescription.addItem(item);
                });

        return prescription;
    }

    private Prescription buildPrescriptionFromEmail(
            Appointment appointment,
            PrescriptionByEmailRequestDTO request) {

        logger.info(
                "Building email-based prescription for appointment {}",
                appointment.getId());

        Prescription prescription = new Prescription();

        prescription.setAppointment(appointment);
        prescription.setDoctor(appointment.getDoctor());
        prescription.setPatient(appointment.getPatient());
        prescription.setDate(appointment.getAppointmentDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        Optional.ofNullable(request.getItems())
                .orElse(List.of())
                .forEach(itemRequest -> {
                    PrescriptionItem item = new PrescriptionItem();

                    item.setMedicineName(
                            itemRequest.getMedicineName());
                    item.setDosage(itemRequest.getDosage());
                    item.setFrequency(itemRequest.getFrequency());
                    item.setDuration(itemRequest.getDuration());

                    prescription.addItem(item);
                });

        return prescription;
    }

    @Override
    public PrescriptionResponseDTO getByAppointmentId(Long appointmentId) {
        Prescription prescription = repository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No prescription for this appointment"));
        return mapper.toDTO(prescription);
    }
}