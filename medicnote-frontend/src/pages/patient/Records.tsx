import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaginated } from "@/hooks/usePaginated";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { appointmentService } from "@/services/appointmentService";
import { prescriptionService } from "@/services/prescriptionService";
import { Stethoscope, Clock, FileText, ExternalLink } from "lucide-react";
import { formatDate, formatTime } from "@/lib/formatters";
import { toast } from "sonner";
import type { AppointmentDTO } from "@/types/appointment.types";
import type { PrescriptionDTO } from "@/types/prescription.types";

const Records: React.FC = () => {
  const { page, setPage, data, loading, error, refetch } = usePaginated<AppointmentDTO>(
    (p, s) => appointmentService.getPatientHistory(p, s),
    { initialPage: 0, initialSize: 7 }
  );

  const visits = useMemo(() => data?.content ?? [], [data]);
  const [matchedByAppt, setMatchedByAppt] = useState<Record<string, PrescriptionDTO | null>>(
    {}
  );

  // After loading, look up the matching prescription (by appointmentId) for each row.
  // We try by-id via the doctor's prescription endpoint but the patient can't call it,
  // so we fall back to scanning the patient's own prescriptions and matching by date+doctor.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fetch a generous page of the patient's own prescriptions and match.
        const res = await prescriptionService.getMyPrescriptions(0, 100);
        const mine = res.data.content;
        const next: Record<string, PrescriptionDTO | null> = {};
        visits.forEach((v) => {
          const hit =
            mine.find(
              (p) =>
                p.date === v.appointmentDate &&
                p.doctorName === v.doctorName
            ) ?? null;
          next[String(v.id)] = hit;
        });
        if (!cancelled) setMatchedByAppt(next);
      } catch {
        if (!cancelled) setMatchedByAppt({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visits]);

  const handleDownload = async (id: number | string) => {
    try {
      const res = await prescriptionService.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      /* interceptor already toasted */
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Medical Records</h1>
          <p className="text-sm text-muted-foreground">
            Your past visit log. Completed visits link to the prescription issued
            at that appointment.
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
              empty={!loading && visits.length === 0}
              emptyTitle="No past visits"
              emptyDescription="Once your appointments are completed, they will appear here."
            >
              <div className="space-y-2">
                {visits.map((v) => {
                  const key = String(v.id);
                  const rx = matchedByAppt[key];
                  return (
                    <div
                      key={key}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {v.doctorName || "Doctor"}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(v.appointmentDate)} • {formatTime(v.appointmentTime)}
                          </span>
                          {typeof v.queueNumber === "number" && (
                            <span className="rounded bg-muted px-1.5 py-0.5">
                              Q#{v.queueNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <StatusBadge status={v.status} />

                      {rx ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(rx.id)}
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5" />
                          Download Rx
                        </Button>
                      ) : v.status === "COMPLETED" ? (
                        <span className="text-xs text-muted-foreground">
                          No prescription issued
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}

                      {rx && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDownload(rx.id)}
                          aria-label="Open prescription"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </PageState>

            <PaginationBar data={data ?? null} page={page} size={7} onPageChange={setPage} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Records;
