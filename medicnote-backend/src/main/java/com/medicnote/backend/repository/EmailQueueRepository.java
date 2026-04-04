package com.medicnote.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicnote.backend.entity.EmailQueue;

public interface EmailQueueRepository extends JpaRepository<EmailQueue, Long> {

    List<EmailQueue> findByStatus(String status);

    List<EmailQueue> findByStatusAndAttemptsLessThan(String status, int attempts);

    boolean existsByAppointmentId(Long appointmentId);
}