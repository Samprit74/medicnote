package com.medicnote.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medicnote.backend.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}