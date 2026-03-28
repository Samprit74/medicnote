package com.medicnote.backend.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {

    public static byte[] generatePrescriptionPdf(Prescription prescription) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);

            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("MEDIC NOTE PRESCRIPTION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));

            // Doctor & Patient Info
            document.add(new Paragraph("Doctor: " + prescription.getDoctor().getName()));
            document.add(new Paragraph("Patient: " + prescription.getPatient().getName()));
            document.add(new Paragraph("Date: " + prescription.getDate()));

            document.add(new Paragraph(" "));

            // Diagnosis
            document.add(new Paragraph("Diagnosis:"));
            document.add(new Paragraph(prescription.getDiagnosis()));

            document.add(new Paragraph(" "));

            // Table for medicines
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            table.addCell("Medicine");
            table.addCell("Dosage");
            table.addCell("Frequency");
            table.addCell("Duration");

            for (PrescriptionItem item : prescription.getItems()) {
                table.addCell(item.getMedicineName());
                table.addCell(item.getDosage());
                table.addCell(item.getFrequency());
                table.addCell(item.getDuration());
            }

            document.add(table);

            document.add(new Paragraph(" "));

            // Notes
            document.add(new Paragraph("Notes:"));
            document.add(new Paragraph(prescription.getNotes()));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF");
        }

        return out.toByteArray();
    }
}