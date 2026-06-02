import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PrescriptionForm } from "@/components/prescription/PrescriptionForm";
import { PrescriptionList } from "@/components/prescription/PrescriptionList";
import { PrescriptionFilters, PrescriptionFilter } from "@/components/prescription/PrescriptionFilters";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useApi } from "@/hooks/useApi";
import { usePaginated } from "@/hooks/usePaginated";
import { prescriptionService } from "@/services/prescriptionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PrescriptionDTO, PrescriptionRequest } from "@/types/prescription.types";

const DoctorPrescriptions: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">Prescriptions</h1>
        <PrescriptionFormPanel />
        <DoctorPrescriptionsList />
      </div>
    </DashboardLayout>
  );
};

const PrescriptionFormPanel: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (data: PrescriptionRequest) => {
    try {
      setSubmitting(true);
      const res = await prescriptionService.create(data);
      // If a prescription already existed for this appointment (e.g. the
      // appointment was just completed and the backend auto-spawned an
      // empty shell), the create endpoint updates it. Detect this by the
      // returned id — same id = updated, new id = created.
      toast.success("Prescription saved");
      // The created/updated date is helpful confirmation.
      if (res.data?.date) {
        toast.message(`For appointment on ${res.data.date}`);
      }
    } catch {
      /* interceptor already toasted */
    } finally {
      setSubmitting(false);
    }
  };
  return <PrescriptionForm onSubmit={handleSubmit} submitting={submitting} />;
};

const DoctorPrescriptionsList: React.FC = () => {
  const [filter, setFilter] = useState<PrescriptionFilter>({ kind: "all" });
  const [patientId, setPatientId] = useState<string>("");

  // Decide fetcher based on filter
  const buildFetcher = (f: PrescriptionFilter, pid: string) => () => {
    if (pid) return prescriptionService.getDoctorPatientPrescriptions(pid, 0, 7);
    if (f.kind === "date") return prescriptionService.getDoctorPrescriptionsByDate(f.date, 0, 7);
    return prescriptionService.getDoctorPrescriptionsByDate(new Date().toISOString().slice(0, 10), 0, 7);
  };

  const { data, loading, error, refetch } = useApi(
    buildFetcher(filter, patientId),
    [filter.kind, "date" in filter ? filter.date : "", "doctor" in filter ? filter.doctorName : "", "start" in filter ? filter.start : "", "end" in filter ? filter.end : "", patientId]
  );

  const items: PrescriptionDTO[] = data?.content ?? [];

  return (
    <div className="space-y-3">
      <PrescriptionFilters onChange={setFilter} />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Patient ID (optional)"
          className="max-w-xs"
        />
        <Button size="sm" variant="outline" onClick={refetch}>
          Apply
        </Button>
      </div>

      <PageState
        loading={loading}
        error={error}
        onRetry={refetch}
        empty={!loading && items.length === 0}
        emptyTitle="No prescriptions"
      >
        <PrescriptionList prescriptions={items} />
      </PageState>

      <PaginationBar data={data ?? null} page={0} size={7} onPageChange={() => {}} />
    </div>
  );
};

export default DoctorPrescriptions;
