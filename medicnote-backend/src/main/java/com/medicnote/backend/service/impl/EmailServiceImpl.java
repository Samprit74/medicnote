package com.medicnote.backend.service.impl;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.medicnote.backend.service.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPrescriptionEmail(String to, String patientName, byte[] pdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your Prescription - MedicNote");

            helper.setText(
                    "Dear " + patientName + ",\n\n" +
                            "Your consultation is complete. Please find your prescription attached.\n\n" +
                            "Regards,\nMedicNote");

            helper.addAttachment("prescription.pdf", new ByteArrayResource(pdf));

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}