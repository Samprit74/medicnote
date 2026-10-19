import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PrescriptionList } from "@/components/prescription/PrescriptionList";
import { PrescriptionFilters, PrescriptionFilter } from "@/components/prescription/PrescriptionFilters";
import { PageState } from "@/components/common/PageState";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useApi } from "@/hooks/useApi";

import { prescriptionService } from "@/services/prescriptionService";
import type { PrescriptionDTO } from "@/types/prescription.types";

const PatientPrescriptions: React.FC = () => {
  const [filter, setFilter] = useState<PrescriptionFilter>({ kind: "all" });

  // When filter is "all" or any of the others, we use the right service method.
  const [page, setPage] = useState(0);
  const size = 7;
  const buildFetcher = (f: PrescriptionFilter, p: number, s: number) => {
    if (f.kind === "date") return () => prescriptionService.getMyPrescriptionsByDate(f.date, p, s);
    if (f.kind === "doctor") return () => prescriptionService.getMyPrescriptionsByDoctor(f.doctorName, p, s);
    if (f.kind === "range") return () => prescriptionService.getMyPrescriptionsByRange(f.start, f.end, p, s);
    return () => prescriptionService.getMyPrescriptions(p, s);
  };

  const { data, loading, error, refetch } = useApi(
    buildFetcher(filter, page, size),
    [
      filter.kind,
      "date" in filter ? filter.date : "",
      "doctor" in filter ? filter.doctorName : "",
      "start" in filter ? filter.start : "",
      "end" in filter ? filter.end : "",
      page,
      size,
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
          page={page}
          size={size}
          onPageChange={setPage}
        />
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescriptions;
