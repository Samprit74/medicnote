import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Pill } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import type { PrescriptionDTO } from "@/types/prescription.types";
import { prescriptionService } from "@/services/prescriptionService";
import { toast } from "sonner";

interface Props {
  prescription: PrescriptionDTO | null;
  onClose: () => void;
}

export const PrescriptionDetailDialog: React.FC<Props> = ({ prescription, onClose }) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!prescription) return;
    try {
      setDownloading(true);
      const res = await prescriptionService.download(prescription.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${prescription.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      /* interceptor already toasted */
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={!!prescription} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        {prescription && (
          <>
            <DialogHeader>
              <DialogTitle>Prescription #{prescription.id}</DialogTitle>
              <DialogDescription>
                {prescription.doctorName} • {formatDate(prescription.date)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Patient
                </p>
                <p className="text-foreground">{prescription.patientName}</p>
              </div>

              {prescription.diagnosis && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Diagnosis
                  </p>
                  <p className="text-foreground">{prescription.diagnosis}</p>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Medications
                </p>
                <div className="space-y-2">
                  {prescription.items?.length ? (
                    prescription.items.map((it, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                        <Pill className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{it.medicineName}</p>
                          <p className="text-xs text-muted-foreground">
                            {it.dosage} • {it.frequency} • {it.duration}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No medications listed.</p>
                  )}
                </div>
              </div>

              {prescription.notes && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-foreground">{prescription.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleDownload} disabled={downloading}>
                <Download className="mr-2 h-4 w-4" />
                {downloading ? "Downloading..." : "Download PDF"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDetailDialog;
