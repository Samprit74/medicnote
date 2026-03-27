package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.PrescriptionDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.exception.ResourceNotFoundException;
import com.medicnote.backend.mapper.PrescriptionMapper;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.repository.PatientRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.service.PrescriptionService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository,
                                   DoctorRepository doctorRepository,
                                   PatientRepository patientRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public PrescriptionDTO savePrescription(PrescriptionDTO dto) {

        Prescription prescription = PrescriptionMapper.toEntity(dto);

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        prescription.setDoctor(doctor);
        prescription.setPatient(patient);

        Prescription saved = prescriptionRepository.save(prescription);

        return PrescriptionMapper.toDTO(saved);
    }

    @Override
    public List<PrescriptionDTO> getAllPrescriptions() {

        return prescriptionRepository.findAll()
                .stream()
                .map(PrescriptionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO getPrescriptionById(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        return PrescriptionMapper.toDTO(prescription);
    }

    @Override
    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO dto) {

        Prescription existing = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        existing.setMedicine(dto.getMedicine());
        existing.setDosage(dto.getDosage());
        existing.setNotes(dto.getNotes());
        existing.setDate(dto.getDate());

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        existing.setDoctor(doctor);
        existing.setPatient(patient);

        Prescription updated = prescriptionRepository.save(existing);

        return PrescriptionMapper.toDTO(updated);
    }

    @Override
    public void deletePrescription(Long id) {

        if (!prescriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescription not found");
        }

        prescriptionRepository.deleteById(id);
    }
}