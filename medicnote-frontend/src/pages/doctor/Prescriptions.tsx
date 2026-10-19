
import React, { useCallback, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PrescriptionForm } from "@/components/prescription/PrescriptionForm";
import { PrescriptionList } from "@/components/prescription/PrescriptionList";
import {
  PrescriptionFilters,
  PrescriptionFilter,
} from "@/components/prescription/PrescriptionFilters";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useApi } from "@/hooks/useApi";
import { prescriptionService } from "@/services/prescriptionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  PrescriptionDTO,
  PrescriptionByEmailRequest,
} from "@/types/prescription.types";

const DoctorPrescriptions: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPrescriptions = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">
          Prescriptions
        </h1>

        <PrescriptionFormPanel
          onSaved={refreshPrescriptions}
        />

        <DoctorPrescriptionsList
          refreshKey={refreshKey}
        />
      </div>
    </DashboardLayout>
  );
};

interface PrescriptionFormPanelProps {
  onSaved: () => void;
}

const PrescriptionFormPanel: React.FC<PrescriptionFormPanelProps> = ({
  onSaved,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PrescriptionByEmailRequest) => {
    try {
      setSubmitting(true);

      await prescriptionService.createWithEmail(data);

      toast.success("Prescription saved successfully.");
      onSaved();
    } catch (error) {
      // Preserve the form data by allowing PrescriptionForm
      // to handle the rejected submission.
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrescriptionForm
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

interface DoctorPrescriptionsListProps {
  refreshKey: number;
}

const DoctorPrescriptionsList: React.FC<
  DoctorPrescriptionsListProps
> = ({ refreshKey }) => {
  const [filter, setFilter] = useState<PrescriptionFilter>({
    kind: "all",
  });

  const [patientId, setPatientId] = useState("");
  const [page, setPage] = useState(0);
  const size = 7;

  const buildFetcher = (
    f: PrescriptionFilter,
    pid: string,
    p: number,
    s: number
  ) => {
    if (pid.trim()) {
      const parsedPatientId = Number(pid);

      if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) {
        return () =>
          Promise.reject(
            new Error("Patient ID must be a positive integer.")
          );
      }

      return () =>
        prescriptionService.getDoctorPatientPrescriptions(
          parsedPatientId,
          p,
          s
        );
    }

    if (f.kind === "date") {
      return () =>
        prescriptionService.getDoctorPrescriptionsByDate(
          f.date,
          p,
          s
        );
    }

    // Default to today's prescriptions.
    return () =>
      prescriptionService.getDoctorPrescriptionsByDate(
        new Date().toISOString().slice(0, 10),
        p,
        s
      );
  };

  const { data, loading, error, refetch } = useApi(
    buildFetcher(filter, patientId, page, size),
    [
      filter.kind,
      "date" in filter ? filter.date : "",
      filter.kind === "doctor" ? filter.doctorName : "",
      "start" in filter ? filter.start : "",
      "end" in filter ? filter.end : "",
      patientId,
      page,
      size,
      refreshKey,
    ]
  );

  const items: PrescriptionDTO[] = data?.content ?? [];

  const handleFilterChange = (nextFilter: PrescriptionFilter) => {
    setFilter(nextFilter);
    setPage(0);
  };

  const handlePatientIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPatientId(event.target.value);
    setPage(0);
  };

  return (
    <div className="space-y-3">
      <PrescriptionFilters onChange={handleFilterChange} />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          min="1"
          value={patientId}
          onChange={handlePatientIdChange}
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
        empty={!loading && !error && items.length === 0}
        emptyTitle="No prescriptions"
      >
        <PrescriptionList prescriptions={items} />
      </PageState>

      <PaginationBar
        data={data ?? null}
        page={page}
        size={size}
        onPageChange={setPage}
      />
    </div>
  );
};

export default DoctorPrescriptions;
