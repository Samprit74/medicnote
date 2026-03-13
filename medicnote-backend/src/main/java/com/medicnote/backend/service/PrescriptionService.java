package com.medicnote.backend.service;

import com.medicnote.backend.dto.PrescriptionDTO;
import java.util.List;

public interface PrescriptionService {

    PrescriptionDTO savePrescription(PrescriptionDTO prescriptionDTO);

    List<PrescriptionDTO> getAllPrescriptions();

    PrescriptionDTO getPrescriptionById(Long id);

    PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO);

    void deletePrescription(Long id);
}