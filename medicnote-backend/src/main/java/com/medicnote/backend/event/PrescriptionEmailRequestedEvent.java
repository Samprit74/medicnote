package com.medicnote.backend.event;


public record PrescriptionEmailRequestedEvent(
        String to,
        String patientName,
        byte[] pdf,
        Long appointmentId
) {
}
