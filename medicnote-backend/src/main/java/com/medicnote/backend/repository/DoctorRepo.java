package com.medicnote.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicnote.backend.Entity.DoctorEntity;

@Repository
public interface DoctorRepo extends JpaRepository<DoctorEntity, Long>{
	
}
