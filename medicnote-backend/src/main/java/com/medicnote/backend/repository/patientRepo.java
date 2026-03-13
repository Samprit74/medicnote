package com.medicnote.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicnote.backend.Entity.patientEntity;

@Repository
public interface patientRepo extends JpaRepository<patientEntity, Long>{

}
