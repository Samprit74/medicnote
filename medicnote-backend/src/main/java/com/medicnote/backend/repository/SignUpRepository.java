package com.medicnote.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicnote.backend.entity.SignUpEntity;

public interface SignUpRepository extends JpaRepository<SignUpEntity, Long>{

	Optional<SignUpEntity> findByUsername(String username);

}
