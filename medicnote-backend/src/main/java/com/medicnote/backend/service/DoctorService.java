package com.medicnote.backend.service;

import com.medicnote.backend.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {

    DoctorDTO saveDoctor(DoctorDTO doctorDTO);

    List<DoctorDTO> getAllDoctors();

    DoctorDTO getDoctorById(Long id);

    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);

    void deleteDoctor(Long id);
}