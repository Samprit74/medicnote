package com.medicnote.backend.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.medicnote.backend.service.EmailQueueService;
import com.medicnote.backend.service.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final EmailQueueService emailQueueService;

    public EmailServiceImpl(JavaMailSender mailSender,
                            EmailQueueService emailQueueService) {
        this.mailSender = mailSender;
        this.emailQueueService = emailQueueService;
    }

    @Override
    @Async
    public void sendPrescriptionEmail(String to, String patientName, byte[] pdf, Long appointmentId) {

        if (emailQueueService.existsByAppointmentId(appointmentId)) {
            return;
        }

        int maxAttempts = 3;

        String subject = "Your Prescription - MedicNote";

        String body = "Dear " + patientName + ",\n\n" +
                "Your consultation is complete. Please find your prescription attached.\n\n" +
                "Regards,\nMedicNote";

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {

            try {
                logger.info("Sending email attempt {} to {}", attempt, to);

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body);
                helper.addAttachment("prescription.pdf", new ByteArrayResource(pdf));

                mailSender.send(message);

                logger.info("Email sent successfully to {}", to);

                emailQueueService.saveSuccessEmail(
                        to,
                        subject,
                        body,
                        appointmentId
                );

                return;

            } catch (Exception e) {

                logger.error("Attempt {} failed for {}", attempt, to, e);

                if (attempt == maxAttempts) {

                    emailQueueService.saveFailedEmail(
                            to,
                            subject,
                            body,
                            appointmentId
                    );
                }

                try {
                    Thread.sleep(3000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}