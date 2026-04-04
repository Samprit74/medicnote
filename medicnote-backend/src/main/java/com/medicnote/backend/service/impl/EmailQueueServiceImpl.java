package com.medicnote.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.medicnote.backend.entity.EmailQueue;
import com.medicnote.backend.repository.EmailQueueRepository;
import com.medicnote.backend.service.EmailQueueService;

@Service
public class EmailQueueServiceImpl implements EmailQueueService {

    private final EmailQueueRepository repository;

    public EmailQueueServiceImpl(EmailQueueRepository repository) {
        this.repository = repository;
    }

    @Override
    public void saveFailedEmail(String to, String subject, String body, Long appointmentId) {

        if (repository.existsByAppointmentId(appointmentId)) {
            return;
        }

        EmailQueue email = new EmailQueue();
        email.setToEmail(to);
        email.setSubject(subject);
        email.setBody(body);
        email.setStatus("PENDING");
        email.setAttempts(0);
        email.setCreatedAt(LocalDateTime.now());
        email.setAppointmentId(appointmentId);

        repository.save(email);
    }

    @Override
    public boolean existsByAppointmentId(Long appointmentId) {
        return repository.existsByAppointmentId(appointmentId);
    }

    @Override
    public void saveSuccessEmail(String to, String subject, String body, Long appointmentId) {

        if (repository.existsByAppointmentId(appointmentId)) {
            return;
        }

        EmailQueue email = new EmailQueue();
        email.setToEmail(to);
        email.setSubject(subject);
        email.setBody(body);
        email.setStatus("SENT");
        email.setAttempts(1);
        email.setCreatedAt(LocalDateTime.now());
        email.setAppointmentId(appointmentId);

        repository.save(email);
    }
}