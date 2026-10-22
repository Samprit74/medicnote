package com.medicnote.backend.util;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.medicnote.backend.entity.Prescription;
import com.medicnote.backend.entity.PrescriptionItem;

public class PdfGenerator {

    private static final Font TITLE_FONT = new Font(Font.TIMES_ROMAN, 22, Font.BOLD, new Color(0, 51, 102));
    private static final Font HEADER_FONT = new Font(Font.TIMES_ROMAN, 13, Font.BOLD, new Color(40, 40, 40));
    private static final Font NORMAL_FONT = new Font(Font.TIMES_ROMAN, 11, Font.NORMAL, new Color(50, 50, 50));
    private static final Font BOLD_FONT = new Font(Font.TIMES_ROMAN, 11, Font.BOLD, new Color(40, 40, 40));
    private static final Font SMALL_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL, new Color(80, 80, 80));
    private static final Font LABEL_FONT = new Font(Font.HELVETICA, 9, Font.BOLD, new Color(100, 100, 100));

    public static byte[] generatePrescriptionPdf(Prescription prescription) {

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 60, 60, 60, 60);
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();

            // ================= WATERMARK =================
            addWatermark(writer);

            // ================= HEADER =================
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            Paragraph clinicInfo = new Paragraph();
            clinicInfo.add(new Chunk("MEDICNOTE CLINIC\n", TITLE_FONT));
            clinicInfo.add(new Chunk("General Healthcare & Wellness Center\n", new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(100, 100, 100))));
            
            PdfPCell leftCell = new PdfPCell(clinicInfo);
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setPaddingBottom(10);
            headerTable.addCell(leftCell);

            Paragraph rightPara = new Paragraph();
            rightPara.add(new Chunk("Dr. " + prescription.getDoctor().getName() + "\n", HEADER_FONT));
            rightPara.add(new Chunk(prescription.getDoctor().getSpecialization() + "\n", NORMAL_FONT));
            rightPara.add(new Chunk(prescription.getDoctor().getEmail(), SMALL_FONT));
            
            PdfPCell rightCell = new PdfPCell(rightPara);
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setPaddingBottom(10);
            headerTable.addCell(rightCell);

            document.add(headerTable);

            // Dividing Line
            PdfContentByte cb = writer.getDirectContent();
            cb.setLineWidth(1f);
            cb.setColorStroke(new Color(0, 51, 102));
            cb.moveTo(60, 740);
            cb.lineTo(535, 740);
            cb.stroke();

            document.add(new Paragraph("\n"));

            // ================= PATIENT DETAILS =================
            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            patientTable.setWidths(new float[]{50, 50});
            patientTable.setSpacingBefore(10);
            patientTable.setSpacingAfter(15);

            PdfPCell cell1 = new PdfPCell();
            cell1.setBorder(Rectangle.NO_BORDER);
            cell1.addElement(new Phrase("PATIENT NAME", LABEL_FONT));
            cell1.addElement(new Phrase(prescription.getPatient().getName().toUpperCase(), BOLD_FONT));
            patientTable.addCell(cell1);

            PdfPCell cell2 = new PdfPCell();
            cell2.setBorder(Rectangle.NO_BORDER);
            cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell2.addElement(new Phrase("DATE", LABEL_FONT));
            cell2.addElement(new Phrase(prescription.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), BOLD_FONT));
            patientTable.addCell(cell2);

            PdfPCell cell3 = new PdfPCell();
            cell3.setBorder(Rectangle.NO_BORDER);
            cell3.addElement(new Phrase("AGE / GENDER", LABEL_FONT));
            cell3.addElement(new Phrase(prescription.getPatient().getAge() + " yrs / " + prescription.getPatient().getGender(), NORMAL_FONT));
            patientTable.addCell(cell3);

            PdfPCell cell4 = new PdfPCell();
            cell4.setBorder(Rectangle.NO_BORDER);
            cell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell4.addElement(new Phrase("PATIENT ID", LABEL_FONT));
            cell4.addElement(new Phrase("PT-" + prescription.getPatient().getId(), NORMAL_FONT));
            patientTable.addCell(cell4);

            document.add(patientTable);

            // ================= DIAGNOSIS =================
            Paragraph diag = new Paragraph();
            diag.add(new Chunk("Diagnosis:  ", LABEL_FONT));
            diag.add(new Chunk(prescription.getDiagnosis(), HEADER_FONT));
            diag.setSpacingAfter(15);
            document.add(diag);

            // ================= Rx SYMBOL =================
            Paragraph rxSymbol = new Paragraph("℞", new Font(Font.TIMES_ROMAN, 26, Font.BOLD, new Color(0, 51, 102)));
            rxSymbol.setSpacingAfter(5);
            document.add(rxSymbol);

            // ================= MEDICINES TABLE =================
            PdfPTable medicineTable = new PdfPTable(4);
            medicineTable.setWidthPercentage(100);
            medicineTable.setWidths(new float[]{40, 20, 20, 20});
            medicineTable.setSpacingBefore(5);
            medicineTable.setSpacingAfter(20);

            String[] headers = {"MEDICINE", "DOSAGE", "FREQUENCY", "DURATION"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE)));
                cell.setBackgroundColor(new Color(0, 51, 102));
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                cell.setPadding(8);
                cell.setBorderColor(new Color(0, 51, 102));
                medicineTable.addCell(cell);
            }

            for (PrescriptionItem item : prescription.getItems()) {
                medicineTable.addCell(createMedicineCell(item.getMedicineName(), BOLD_FONT));
                medicineTable.addCell(createMedicineCell(item.getDosage(), NORMAL_FONT));
                medicineTable.addCell(createMedicineCell(item.getFrequency(), NORMAL_FONT));
                medicineTable.addCell(createMedicineCell(item.getDuration(), NORMAL_FONT));
            }

            document.add(medicineTable);

            // ================= NOTES =================
            Paragraph notesTitle = new Paragraph("NOTES / ADVICE", LABEL_FONT);
            notesTitle.setSpacingAfter(4);
            document.add(notesTitle);

            Paragraph notes = new Paragraph(
                    prescription.getNotes() != null ? prescription.getNotes() : "-",
                    new Font(Font.TIMES_ROMAN, 11, Font.ITALIC, new Color(60, 60, 60))
            );
            notes.setSpacingAfter(30);
            document.add(notes);

            // ================= SIGNATURE =================
            PdfPTable signatureTable = new PdfPTable(2);
            signatureTable.setWidthPercentage(100);
            signatureTable.setWidths(new float[]{60, 40});
            signatureTable.setSpacingBefore(40);

            PdfPCell empty = new PdfPCell(new Phrase(""));
            empty.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(empty);

            Paragraph sig = new Paragraph();
            sig.setAlignment(Element.ALIGN_RIGHT);
            sig.add(new Chunk("________________________\n", SMALL_FONT));
            sig.add(new Chunk("Dr. " + prescription.getDoctor().getName() + "\n", BOLD_FONT));
            sig.add(new Chunk("Registered Medical Practitioner", SMALL_FONT));

            PdfPCell sigCell = new PdfPCell(sig);
            sigCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sigCell.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(sigCell);

            document.add(signatureTable);

            document.add(new Paragraph("\n\n"));

            // ================= FOOTER =================
            Paragraph footer = new Paragraph(
                    "This is a digitally generated prescription by MedicNote. Valid without physical signature.",
                    new Font(Font.HELVETICA, 8, Font.NORMAL, new Color(150, 150, 150))
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private static PdfPCell createMedicineCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setBorderColor(new Color(220, 220, 220));
        return cell;
    }

    // ================= WATERMARK METHOD =================
    private static void addWatermark(PdfWriter writer) {
        PdfContentByte canvas = writer.getDirectContentUnder();

        Font watermarkFont = new Font(Font.TIMES_ROMAN, 55, Font.BOLDITALIC, new Color(200, 220, 240));

        Phrase watermark = new Phrase("MedicNote", watermarkFont);

        PdfGState gs = new PdfGState();
        gs.setFillOpacity(0.25f); 

        canvas.saveState();
        canvas.setGState(gs);

        ColumnText.showTextAligned(
                canvas,
                Element.ALIGN_CENTER,
                watermark,
                297,
                450,
                45
        );

        canvas.restoreState();
    }
}
