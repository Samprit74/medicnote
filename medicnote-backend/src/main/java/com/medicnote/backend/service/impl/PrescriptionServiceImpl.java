package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.request.PrescriptionByEmailRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.entity.Appointment;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;
import com.medicnote.backend.entity.User;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
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

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionServiceImpl.class);

    private final PrescriptionRepository repository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionMapper mapper;
    private final UserRepository userRepository;

    public PrescriptionServiceImpl(PrescriptionRepository repository,
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
    public PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long userId) {

        logger.info("Creating prescription for user {}", userId);

        Doctor doctor = resolveDoctor(userId);

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        validateDoctor(appointment, doctor.getId());
        checkDuplicate(appointment);

        Prescription prescription = buildPrescription(appointment, request);
        return mapper.toDTO(repository.save(prescription));
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO createUsingAppointment(Long appointmentId,
                                                          PrescriptionRequestDTO request,
                                                          Long userId) {

        logger.info("Creating prescription using appointment {} by user {}", appointmentId, userId);

        Doctor doctor = resolveDoctor(userId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        validateDoctor(appointment, doctor.getId());
        checkDuplicate(appointment);

        Prescription prescription = buildPrescription(appointment, request);
        return mapper.toDTO(repository.save(prescription));
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO createUsingEmail(PrescriptionByEmailRequestDTO request, Long userId) {

        logger.info("Creating prescription via email for user {}", userId);

        Doctor doctor = resolveDoctor(userId);

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        validateDoctor(appointment, doctor.getId());

        if (!appointment.getPatient().getEmail().equals(request.getPatientEmail())) {
            throw new IllegalArgumentException("Patient mismatch");
        }

        checkDuplicate(appointment);

        Prescription prescription = buildPrescriptionFromEmail(appointment, request);
        return mapper.toDTO(repository.save(prescription));
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatient(Long userId, int page, int size) {

        Patient patient = resolvePatient(userId);

        return repository.findByPatientIdOrderByDateDesc(patient.getId(), PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDate(Long userId, LocalDate date, int page, int size) {

        Patient patient = resolvePatient(userId);

        return repository.findByPatientIdAndDate(patient.getId(), date, PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDoctor(Long userId, String doctorName, int page, int size) {

        Patient patient = resolvePatient(userId);

        return repository.findByPatientIdAndDoctorNameContainingIgnoreCase(
                patient.getId(), doctorName, PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDateRange(Long userId, String start, String end, int page, int size) {

        Patient patient = resolvePatient(userId);

        return repository.findByPatientIdAndDateBetweenOrderByDateDesc(
                patient.getId(),
                LocalDate.parse(start),
                LocalDate.parse(end),
                PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId, int page, int size) {
        return repository.findByDoctorIdAndPatientIdOrderByDateDesc(
                doctorId,
                patientId,
                PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getDoctorPrescriptionsByDate(Long doctorId, LocalDate date, int page, int size) {
        return repository.findByDoctorIdAndDate(
                doctorId,
                date,
                PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public PrescriptionResponseDTO getById(Long id) {

        Prescription prescription = repository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        return mapper.toDTO(prescription);
    }

    @Override
    public byte[] generatePdf(Long id) {

        Prescription prescription = repository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        return PdfGenerator.generatePrescriptionPdf(prescription);
    }

    private Doctor resolveDoctor(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Doctor doctor = user.getDoctor();
        if (doctor == null) {
            throw new AccessDeniedException("Not a doctor");
        }

        return doctor;
    }

    private Patient resolvePatient(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient = user.getPatient();
        if (patient == null) {
            throw new AccessDeniedException("Not a patient");
        }

        return patient;
    }

    private void validateDoctor(Appointment appointment, Long doctorId) {
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AccessDeniedException("Not allowed");
        }
    }

    private void checkDuplicate(Appointment appointment) {

        boolean exists = repository.existsByAppointmentId(appointment.getId());

        if (exists) {
            throw new IllegalArgumentException("Prescription already exists for this appointment");
        }
    }

    private Prescription buildPrescription(Appointment appointment, PrescriptionRequestDTO request) {

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctor(appointment.getDoctor());
        prescription.setPatient(appointment.getPatient());
        prescription.setDate(appointment.getAppointmentDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        Optional.ofNullable(request.getItems()).orElse(java.util.List.of()).forEach(i -> {
            PrescriptionItem item = new PrescriptionItem();
            item.setMedicineName(i.getMedicineName());
            item.setDosage(i.getDosage());
            item.setFrequency(i.getFrequency());
            item.setDuration(i.getDuration());
            prescription.addItem(item);
        });

        return prescription;
    }

    private Prescription buildPrescriptionFromEmail(Appointment appointment, PrescriptionByEmailRequestDTO request) {

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctor(appointment.getDoctor());
        prescription.setPatient(appointment.getPatient());
        prescription.setDate(appointment.getAppointmentDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        Optional.ofNullable(request.getItems()).orElse(java.util.List.of()).forEach(i -> {
            PrescriptionItem item = new PrescriptionItem();
            item.setMedicineName(i.getMedicineName());
            item.setDosage(i.getDosage());
            item.setFrequency(i.getFrequency());
            item.setDuration(i.getDuration());
            prescription.addItem(item);
        });

        return prescription;
    }
}