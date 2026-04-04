package com.medicnote.backend.scheduler;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.medicnote.backend.entity.EmailQueue;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.repository.EmailQueueRepository;
import com.medicnote.backend.repository.PrescriptionRepository;
import com.medicnote.backend.util.PdfGenerator;

import jakarta.mail.internet.MimeMessage;

@Component
public class EmailRetryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(EmailRetryScheduler.class);

    private final EmailQueueRepository repository;
    private final JavaMailSender mailSender;
    private final PrescriptionRepository prescriptionRepository;

    public EmailRetryScheduler(EmailQueueRepository repository,
            JavaMailSender mailSender,
            PrescriptionRepository prescriptionRepository) {
        this.repository = repository;
        this.mailSender = mailSender;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Scheduled(fixedRate = 300000)
    public void retryFailedEmails() {

        logger.info("Running email retry job...");

        List<EmailQueue> emails = repository.findByStatusAndAttemptsLessThan("PENDING", 3);

        for (EmailQueue email : emails) {

            try {
                Prescription prescription = prescriptionRepository
                        .findByAppointmentId(email.getAppointmentId())
                        .orElseThrow(() -> new RuntimeException("Prescription not found"));

                byte[] pdf = PdfGenerator.generatePrescriptionPdf(prescription);

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setTo(email.getToEmail());
                helper.setSubject(email.getSubject());
                helper.setText(email.getBody());
                helper.addAttachment("prescription.pdf", new ByteArrayResource(pdf));

                mailSender.send(message);

                email.setStatus("SENT");
                repository.save(email);

                logger.info("Retry email sent to {}", email.getToEmail());

            } catch (Exception e) {

                email.setAttempts(email.getAttempts() + 1);

                if (email.getAttempts() >= 3) {
                    email.setStatus("FAILED");
                }

                repository.save(email);

                logger.error("Retry failed for {}", email.getToEmail(), e);
            }
        }
    }
}