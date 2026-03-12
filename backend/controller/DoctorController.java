package com.medicnote.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.medicnote.backend.entity.Doctor;
import com.medicnote.backend.service.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
}