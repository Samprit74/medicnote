package com.medicnote.backend.event;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.medicnote.backend.service.EmailService;

@Component
public class PrescriptionEmailEventListener {

    private final EmailService emailService;

    public PrescriptionEmailEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePrescriptionEmail(
            PrescriptionEmailRequestedEvent event) {

        emailService.sendPrescriptionEmail(
                event.to(),
                event.patientName(),
                event.pdf(),
                event.appointmentId()
        );
    }
}