package com.medicnote.backend.service.impl;

import com.medicnote.backend.dto.DoctorDTO;
import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.repository.DoctorRepository;
import com.medicnote.backend.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public DoctorDTO saveDoctor(DoctorDTO doctorDTO) {

        Doctor doctor = new Doctor();
        doctor.setName(doctorDTO.getName());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setSpecialization(doctorDTO.getSpecialization());

        Doctor savedDoctor = doctorRepository.save(doctor);

        DoctorDTO response = new DoctorDTO();
        response.setId(savedDoctor.getId());
        response.setName(savedDoctor.getName());
        response.setEmail(savedDoctor.getEmail());
        response.setSpecialization(savedDoctor.getSpecialization());

        return response;
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {

        List<Doctor> doctors = doctorRepository.findAll();

        return doctors.stream().map(doctor -> {
            DoctorDTO dto = new DoctorDTO();
            dto.setId(doctor.getId());
            dto.setName(doctor.getName());
            dto.setEmail(doctor.getEmail());
            dto.setSpecialization(doctor.getSpecialization());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id).orElseThrow();

        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setEmail(doctor.getEmail());
        dto.setSpecialization(doctor.getSpecialization());

        return dto;
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {

        Doctor doctor = doctorRepository.findById(id).orElseThrow();

        doctor.setName(doctorDTO.getName());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setSpecialization(doctorDTO.getSpecialization());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        DoctorDTO response = new DoctorDTO();
        response.setId(updatedDoctor.getId());
        response.setName(updatedDoctor.getName());
        response.setEmail(updatedDoctor.getEmail());
        response.setSpecialization(updatedDoctor.getSpecialization());

        return response;
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}