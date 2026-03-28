package com.medicnote.backend.service.impl;

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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
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
    public PrescriptionResponseDTO create(PrescriptionRequestDTO request, Long doctorId) {

        logger.info("Creating prescription for doctor {}", doctorId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setDate(request.getDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        List<PrescriptionItem> items = request.getItems()
                .stream()
                .map(i -> {
                    PrescriptionItem item = new PrescriptionItem();
                    item.setMedicineName(i.getMedicineName());
                    item.setDosage(i.getDosage());
                    item.setFrequency(i.getFrequency());
                    item.setDuration(i.getDuration());
                    item.setPrescription(prescription);
                    return item;
                })
                .collect(Collectors.toList());

        prescription.setItems(items);

        Prescription saved = prescriptionRepository.save(prescription);

        return mapper.toDTO(saved);
    }

    @Override
    public List<PrescriptionResponseDTO> getByPatient(Long patientId) {

        logger.info("Fetching prescriptions for patient {}", patientId);

        return prescriptionRepository.findByPatientIdOrderByDateDesc(patientId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDTO> getByDoctor(Long doctorId) {

        logger.info("Fetching prescriptions for doctor {}", doctorId);

        return prescriptionRepository.findByDoctorId(doctorId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponseDTO getById(Long id) {

        logger.info("Fetching prescription {}", id);

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        return mapper.toDTO(prescription);
    }

    @Override
    public List<PrescriptionResponseDTO> getByPatientAndDateRange(Long patientId, String start, String end) {

        logger.info("Fetching prescriptions by date range");

        return prescriptionRepository.findByPatientIdAndDateBetween(
                        patientId,
                        LocalDate.parse(start),
                        LocalDate.parse(end)
                )
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDTO> getDoctorPatientPrescriptions(Long doctorId, Long patientId) {

        logger.info("Fetching doctor-patient prescriptions");

        return prescriptionRepository.findByDoctorIdAndPatientId(doctorId, patientId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}