package com.medicnote.backend.util;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;

public class PdfGenerator {

    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 51, 102));
    private static final Font HEADER_FONT = new Font(Font.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL);
    private static final Font BOLD_FONT = new Font(Font.HELVETICA, 10, Font.BOLD);
    private static final Font SMALL_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL);

    public static byte[] generatePrescriptionPdf(Prescription prescription) {

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{70, 30});

            Paragraph clinicInfo = new Paragraph();
            clinicInfo.add(new Chunk("MEDICNOTE CLINIC\n", TITLE_FONT));
            clinicInfo.add(new Chunk(prescription.getDoctor().getName() + "\n", HEADER_FONT));
            clinicInfo.add(new Chunk("General Physician\n", NORMAL_FONT));
            clinicInfo.add(new Chunk("Email: " + prescription.getDoctor().getEmail(), SMALL_FONT));

            PdfPCell leftCell = new PdfPCell(clinicInfo);
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setPadding(10);
            headerTable.addCell(leftCell);

            Paragraph rightPara = new Paragraph();
            rightPara.add(new Chunk("PRESCRIPTION\n", new Font(Font.HELVETICA, 14, Font.BOLD, Color.RED)));
            rightPara.add(new Chunk(
                    prescription.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    NORMAL_FONT
            ));

            PdfPCell rightCell = new PdfPCell(rightPara);
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setPadding(10);
            headerTable.addCell(rightCell);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            PdfPTable patientTable = new PdfPTable(4);
            patientTable.setWidthPercentage(100);
            patientTable.setWidths(new float[]{20, 30, 20, 30});

            addPatientCell(patientTable, "Patient Name:", prescription.getPatient().getName());
            addPatientCell(patientTable, "Age / Gender:",
                    prescription.getPatient().getAge() + " / " + prescription.getPatient().getGender());
            addPatientCell(patientTable, "Date:",
                    prescription.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            addPatientCell(patientTable, "Patient ID:",
                    "PT-" + prescription.getPatient().getId());

            PdfPCell patientInfoCell = new PdfPCell(patientTable);
            patientInfoCell.setBackgroundColor(new Color(240, 248, 255));
            patientInfoCell.setPadding(10);
            document.add(patientInfoCell);

            document.add(new Paragraph("\n"));

            Paragraph diagnosis = new Paragraph("Diagnosis: " + prescription.getDiagnosis(), HEADER_FONT);
            document.add(diagnosis);

            document.add(new Paragraph("\n"));

            PdfPTable medicineTable = new PdfPTable(4);
            medicineTable.setWidthPercentage(100);
            medicineTable.setWidths(new float[]{35, 20, 25, 20});

            String[] headers = {"Medicine", "Dosage", "Frequency", "Duration"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, BOLD_FONT));
                cell.setBackgroundColor(new Color(0, 51, 102));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(8);
                cell.setBorderColor(Color.WHITE);
                cell.setPhrase(new Phrase(header, new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE)));
                medicineTable.addCell(cell);
            }

            for (PrescriptionItem item : prescription.getItems()) {
                medicineTable.addCell(new PdfPCell(new Phrase(item.getMedicineName(), NORMAL_FONT)));
                medicineTable.addCell(new PdfPCell(new Phrase(item.getDosage(), NORMAL_FONT)));
                medicineTable.addCell(new PdfPCell(new Phrase(item.getFrequency(), NORMAL_FONT)));
                medicineTable.addCell(new PdfPCell(new Phrase(item.getDuration(), NORMAL_FONT)));
            }

            document.add(medicineTable);
            document.add(new Paragraph("\n"));

            Paragraph notesTitle = new Paragraph("Notes:", HEADER_FONT);
            document.add(notesTitle);

            Paragraph notes = new Paragraph(
                    prescription.getNotes() != null ? prescription.getNotes() : "-",
                    NORMAL_FONT
            );
            document.add(notes);

            document.add(new Paragraph("\n\n"));

            PdfPTable signatureTable = new PdfPTable(2);
            signatureTable.setWidthPercentage(100);
            signatureTable.setWidths(new float[]{50, 50});

            PdfPCell empty = new PdfPCell(new Phrase(""));
            empty.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(empty);

            Paragraph sig = new Paragraph();
            sig.add(new Chunk(prescription.getDoctor().getName() + "\n", BOLD_FONT));
            sig.add(new Chunk("Registered Medical Practitioner\n", SMALL_FONT));

            PdfPCell sigCell = new PdfPCell(sig);
            sigCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sigCell.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(sigCell);

            document.add(signatureTable);

            document.add(new Paragraph("\n"));

            Paragraph footer = new Paragraph(
                    "Generated by MedicNote",
                    SMALL_FONT
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private static void addPatientCell(PdfPTable table, String label, String value) {
        table.addCell(new PdfPCell(new Phrase(label, BOLD_FONT)));
        table.addCell(new PdfPCell(new Phrase(value, NORMAL_FONT)));
    }
}