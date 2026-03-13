package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.PrescriptionDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.entity.Patient;
import com.medicnote.backend.entity.Prescription;
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
    public PrescriptionDTO savePrescription(PrescriptionDTO prescriptionDTO) {

        Doctor doctor = doctorRepository.findById(prescriptionDTO.getDoctorId()).orElseThrow();
        Patient patient = patientRepository.findById(prescriptionDTO.getPatientId()).orElseThrow();

        Prescription prescription = new Prescription();
        prescription.setMedicine(prescriptionDTO.getMedicine());
        prescription.setDosage(prescriptionDTO.getDosage());
        prescription.setNotes(prescriptionDTO.getNotes());
        prescription.setDate(prescriptionDTO.getDate());
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        PrescriptionDTO response = new PrescriptionDTO();
        response.setId(savedPrescription.getId());
        response.setMedicine(savedPrescription.getMedicine());
        response.setDosage(savedPrescription.getDosage());
        response.setNotes(savedPrescription.getNotes());
        response.setDate(savedPrescription.getDate());
        response.setDoctorId(savedPrescription.getDoctor().getId());
        response.setPatientId(savedPrescription.getPatient().getId());

        return response;
    }

    @Override
    public List<PrescriptionDTO> getAllPrescriptions() {

        List<Prescription> prescriptions = prescriptionRepository.findAll();

        return prescriptions.stream().map(prescription -> {
            PrescriptionDTO dto = new PrescriptionDTO();
            dto.setId(prescription.getId());
            dto.setMedicine(prescription.getMedicine());
            dto.setDosage(prescription.getDosage());
            dto.setNotes(prescription.getNotes());
            dto.setDate(prescription.getDate());
            dto.setDoctorId(prescription.getDoctor().getId());
            dto.setPatientId(prescription.getPatient().getId());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO getPrescriptionById(Long id) {

        Prescription prescription = prescriptionRepository.findById(id).orElseThrow();

        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setMedicine(prescription.getMedicine());
        dto.setDosage(prescription.getDosage());
        dto.setNotes(prescription.getNotes());
        dto.setDate(prescription.getDate());
        dto.setDoctorId(prescription.getDoctor().getId());
        dto.setPatientId(prescription.getPatient().getId());

        return dto;
    }

    @Override
    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO) {

        Prescription prescription = prescriptionRepository.findById(id).orElseThrow();

        Doctor doctor = doctorRepository.findById(prescriptionDTO.getDoctorId()).orElseThrow();
        Patient patient = patientRepository.findById(prescriptionDTO.getPatientId()).orElseThrow();

        prescription.setMedicine(prescriptionDTO.getMedicine());
        prescription.setDosage(prescriptionDTO.getDosage());
        prescription.setNotes(prescriptionDTO.getNotes());
        prescription.setDate(prescriptionDTO.getDate());
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);

        Prescription updated = prescriptionRepository.save(prescription);

        PrescriptionDTO response = new PrescriptionDTO();
        response.setId(updated.getId());
        response.setMedicine(updated.getMedicine());
        response.setDosage(updated.getDosage());
        response.setNotes(updated.getNotes());
        response.setDate(updated.getDate());
        response.setDoctorId(updated.getDoctor().getId());
        response.setPatientId(updated.getPatient().getId());

        return response;
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}