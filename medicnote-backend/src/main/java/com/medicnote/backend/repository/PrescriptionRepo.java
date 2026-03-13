package com.medicnote.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicnote.backend.Entity.PrescriptionEntity;

public interface PrescriptionRepo extends JpaRepository<PrescriptionEntity, Long>{

}
