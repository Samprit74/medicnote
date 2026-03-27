package com.medicnote.backend.controller;

import com.medicnote.backend.dto.PrescriptionDTO;
import com.medicnote.backend.service.PrescriptionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public PrescriptionDTO createPrescription(@Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        return prescriptionService.savePrescription(prescriptionDTO);
    }

    @GetMapping
    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public PrescriptionDTO getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }

    @PutMapping("/{id}")
    public PrescriptionDTO updatePrescription(@PathVariable Long id,
                                              @Valid @RequestBody PrescriptionDTO prescriptionDTO) {
        return prescriptionService.updatePrescription(id, prescriptionDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
    }
}