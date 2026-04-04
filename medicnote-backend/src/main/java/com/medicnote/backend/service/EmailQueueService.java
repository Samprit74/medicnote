package com.medicnote.backend.service;

public interface EmailQueueService {

    void saveFailedEmail(String to, String subject, String body, Long appointmentId);

    boolean existsByAppointmentId(Long appointmentId);

    void saveSuccessEmail(String to, String subject, String body, Long appointmentId);
}