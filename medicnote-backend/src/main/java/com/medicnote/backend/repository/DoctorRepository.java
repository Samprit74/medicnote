package com.medicnote.backend.repository;

import com.medicnote.backend.entity.Doctor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    List<Doctor> findBySpecializationIgnoreCaseAndExperienceGreaterThanEqual(
            String specialization,
            Integer experience
    );

    List<Doctor> findByExperienceGreaterThanEqual(Integer experience);

    List<Doctor> findBySpecializationIgnoreCaseOrderByExperienceDesc(String specialization);

    List<Doctor> findBySpecializationIgnoreCaseAndExperienceGreaterThanEqualOrderByExperienceDesc(
            String specialization,
            Integer experience
    );

    Page<Doctor> findBySpecializationIgnoreCase(String specialization, Pageable pageable);

    Page<Doctor> findBySpecializationIgnoreCaseAndExperienceGreaterThanEqual(
            String specialization,
            Integer experience,
            Pageable pageable
    );

    Page<Doctor> findByExperienceGreaterThanEqual(Integer experience, Pageable pageable);
}