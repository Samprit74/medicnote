package com.medicnote.backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicnote.backend.dto.request.PrescriptionRequestDTO;
import com.medicnote.backend.dto.response.PrescriptionResponseDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.PrescriptionMapper;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.service.PrescriptionService;
import com.medicnote.backend.util.PdfGenerator;

@Service
@Transactional(readOnly = true)
public class PrescriptionServiceImpl implements PrescriptionService {

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionServiceImpl.class);

    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionMapper mapper;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository,
                                   DoctorRepository doctorRepository,
                                   PatientRepository patientRepository,
                                   PrescriptionMapper mapper) {
        this.prescriptionRepository = prescriptionRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long doctorId) {

        logger.info("Creating prescription for doctor {}", doctorId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> {
                    logger.error("Doctor not found with id {}", doctorId);
                    return new ResourceNotFoundException("Doctor not found");
                });

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> {
                    logger.error("Patient not found with id {}", request.getPatientId());
                    return new ResourceNotFoundException("Patient not found");
                });

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setDate(request.getDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        Optional.ofNullable(request.getItems())
                .orElse(List.of())
                .forEach(i -> {
                    PrescriptionItem item = new PrescriptionItem();
                    item.setMedicineName(i.getMedicineName());
                    item.setDosage(i.getDosage());
                    item.setFrequency(i.getFrequency());
                    item.setDuration(i.getDuration());
                    prescription.addItem(item);
                });

        Prescription saved = prescriptionRepository.save(prescription);

        logger.info("Prescription created successfully with id {}", saved.getId());

        return mapper.toDTO(saved);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatient(Long patientId, int page, int size) {

        logger.info("Fetching prescriptions for patient {} page {} size {}", patientId, page, size);

        return prescriptionRepository
                .findByPatientIdOrderByDateDesc(patientId, PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByDoctor(Long doctorId, int page, int size) {

        logger.info("Fetching prescriptions for doctor {} page {} size {}", doctorId, page, size);

        return prescriptionRepository
                .findByDoctorIdOrderByDateDesc(doctorId, PageRequest.of(page, size))
                .map(mapper::toDTO);
    }

    @Override
    public PrescriptionResponseDTO getById(Long id) {

        logger.info("Fetching prescription {}", id);

        Prescription prescription = prescriptionRepository.findWithDetailsById(id)
                .orElseThrow(() -> {
                    logger.error("Prescription not found with id {}", id);
                    return new ResourceNotFoundException("Prescription not found");
                });

        return mapper.toDTO(prescription);
    }

    @Override
    public Page<PrescriptionResponseDTO> getByPatientAndDateRange(Long patientId, String start, String end, int page, int size) {

        logger.info("Fetching prescriptions for patient {} between {} and {}", patientId, start, end);

        return prescriptionRepository
                .findByPatientIdAndDateBetweenOrderByDateDesc(
                        patientId,
                        LocalDate.parse(start),
                        LocalDate.parse(end),
                        PageRequest.of(page, size)
                )
                .map(mapper::toDTO);
    }

    @Override
    public List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId) {

        logger.info("Fetching prescriptions for doctor {} and patient {}", doctorId, patientId);

        return prescriptionRepository
                .findByDoctorIdAndPatientIdOrderByDateDesc(doctorId, patientId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] generatePdf(Long id) {

        logger.info("Generating PDF for prescription {}", id);

        Prescription prescription = prescriptionRepository.findWithDetailsById(id)
                .orElseThrow(() -> {
                    logger.error("Prescription not found with id {}", id);
                    return new ResourceNotFoundException("Prescription not found");
                });

        return PdfGenerator.generatePrescriptionPdf(prescription);
    }
}