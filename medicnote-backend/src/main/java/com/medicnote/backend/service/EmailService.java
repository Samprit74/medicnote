package com.medicnote.backend.service;

public interface EmailService {

    void sendPrescriptionEmail(String to, String patientName, byte[] pdf);
}