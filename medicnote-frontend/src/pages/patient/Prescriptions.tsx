import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PrescriptionList } from "@/components/prescription/PrescriptionList";
import { PrescriptionFilters, PrescriptionFilter } from "@/components/prescription/PrescriptionFilters";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useApi } from "@/hooks/useApi";
import { usePaginated } from "@/hooks/usePaginated";
import { prescriptionService } from "@/services/prescriptionService";
import type { PrescriptionDTO } from "@/types/prescription.types";

const PatientPrescriptions: React.FC = () => {
  const [filter, setFilter] = useState<PrescriptionFilter>({ kind: "all" });

  // When filter is "all" or any of the others, we use the right service method.
  const buildFetcher = (f: PrescriptionFilter) => {
    if (f.kind === "date") return () => prescriptionService.getMyPrescriptionsByDate(f.date);
    if (f.kind === "doctor") return () => prescriptionService.getMyPrescriptionsByDoctor(f.doctorName);
    if (f.kind === "range") return () => prescriptionService.getMyPrescriptionsByRange(f.start, f.end);
    return () => prescriptionService.getMyPrescriptions();
  };

  const { data, loading, error, refetch } = useApi(
    buildFetcher(filter),
    [
      filter.kind,
      "date" in filter ? filter.date : "",
      "doctor" in filter ? filter.doctorName : "",
      "start" in filter ? filter.start : "",
      "end" in filter ? filter.end : "",
    ]
  );

  const items: PrescriptionDTO[] = data?.content ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">My Prescriptions</h1>
        <PrescriptionFilters onChange={setFilter} />
        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          empty={!loading && items.length === 0}
          emptyTitle="No prescriptions yet"
        >
          <PrescriptionList prescriptions={items} />
        </PageState>
        <PaginationBar
          data={data ?? null}
          page={0}
          size={7}
          onPageChange={() => {
            /* page=0 only for this view */
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescriptions;
