import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaginated } from "@/hooks/usePaginated";
import { useApi } from "@/hooks/useApi";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PrescriptionDetailDialog } from "@/components/prescription/PrescriptionDetailDialog";
import { appointmentService } from "@/services/appointmentService";
import { prescriptionService } from "@/services/prescriptionService";
import { Stethoscope, Clock, Eye, Download } from "lucide-react";
import { formatDate, formatTime } from "@/lib/formatters";
import { toast } from "sonner";
import type { AppointmentDTO } from "@/types/appointment.types";
import type { PrescriptionDTO } from "@/types/prescription.types";

const Records: React.FC = () => {
  const { page, setPage, data, loading, error, refetch } =
    usePaginated<AppointmentDTO>(
      (p, s) => appointmentService.getPatientHistory(p, s),
      { initialPage: 0, initialSize: 7 }
    );

  const visits = data?.content ?? [];

  // Which appointment the user clicked "View" on (drives the popup).
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentDTO | null>(null);

  // Lazy fetch of the prescription only when the popup is open.
  const {
    data: prescription,
    loading: prescriptionLoading,
    error: prescriptionError,
  } = useApi<PrescriptionDTO>(
    () =>
      selectedAppointment
        ? prescriptionService.getByAppointmentId(selectedAppointment.id)
        : Promise.reject(new Error("no appointment selected")),
    [selectedAppointment?.id ?? 0]
  );

  const closePrescription = () => setSelectedAppointment(null);

  // EYE: open the popup with details (no download, no side effects).
  const handleView = (visit: AppointmentDTO) => {
    setSelectedAppointment(visit);
  };

  // ARROW: fetch the prescription, then download the PDF directly.
  const handleDownloadPdf = async (visit: AppointmentDTO) => {
    try {
      const prescriptionRes = await prescriptionService.getByAppointmentId(
        visit.id
      );

      const pdfRes = await prescriptionService.download(
        prescriptionRes.data.id
      );

      const url = window.URL.createObjectURL(
        new Blob([pdfRes.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `prescription-${prescriptionRes.data.id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      toast.success("Download started");
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        toast.error("No prescription available for this appointment.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Medical Records
          </h1>
          <p className="text-sm text-muted-foreground">
            Your completed visits. Use the eye icon to view the prescription
            details, or the download icon to save the PDF.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visit log</CardTitle>
          </CardHeader>

          <CardContent>
            <PageState
              loading={loading}
              error={error}
              onRetry={refetch}
              loadingKind="table"
              empty={!loading && visits.length === 0}
              emptyTitle="No past visits"
              emptyDescription="Once your appointments are completed, they will appear here."
            >
              <div className="space-y-2">
                {visits.map((visit) => (
                  <div
                    key={String(visit.id)}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {visit.doctorName || "Doctor"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatDate(visit.appointmentDate)} ·{" "}
                          {formatTime(visit.appointmentTime)}
                        </span>

                        {typeof visit.queueNumber === "number" && (
                          <span className="rounded bg-muted px-1.5 py-0.5">
                            Q#{visit.queueNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <StatusBadge status={visit.status} />

                    {/* EYE → open details popup */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleView(visit)}
                      aria-label="View prescription"
                      className="text-primary hover:text-primary/80"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* DOWNLOAD → fetch and save PDF */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => void handleDownloadPdf(visit)}
                      aria-label="Download prescription PDF"
                      className="text-primary hover:text-primary/80"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </PageState>

            <PaginationBar
              data={data ?? null}
              page={page}
              size={7}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Popup: only the eye button triggers this */}
      {selectedAppointment && prescriptionLoading && (
        <Dialog open onOpenChange={closePrescription}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Loading prescription…</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {selectedAppointment && !prescriptionLoading && prescriptionError && (
        <Dialog open onOpenChange={closePrescription}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No prescription</DialogTitle>
              <DialogDescription>
                This appointment has no prescription attached.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={closePrescription}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedAppointment && !prescriptionLoading && prescription && (
        <PrescriptionDetailDialog
          prescription={prescription}
          onClose={closePrescription}
        />
      )}
    </DashboardLayout>
  );
};

export default Records;