import React, { useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useApi } from "@/hooks/useApi";
import { appointmentService } from "@/services/appointmentService";
import { PageState } from "@/components/common/PageState";
import { AppointmentList } from "@/components/appointment/AppointmentList";
import { EmptyIllustration } from "@/components/common/EmptyIllustration";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { AppointmentDTO } from "@/types/appointment.types";

const Queue: React.FC = () => {
  const { data, loading, error, refetch } = useApi<AppointmentDTO[]>(
    () => appointmentService.getDoctorQueue(),
    []
  );

  const handleComplete = useCallback(
    async (id: AppointmentDTO["id"]) => {
      try {
        await appointmentService.updateStatus(id, "COMPLETED");
        toast.success("Appointment completed. PDF emailed to patient.");
        refetch();
      } catch {
        /* interceptor already toasted */
      }
    },
    [refetch]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Patient Queue</h1>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingKind="table"
          empty={!loading && (data?.length ?? 0) === 0}
          emptyTitle="Queue is clear!"
          emptyDescription="No patients waiting. See you at the next one."
          emptyIcon={<EmptyIllustration kind="queue" className="h-20 w-20" />}
        >
          <AppointmentList
            appointments={data ?? []}
            onComplete={handleComplete}
            emptyLabel="No patients in queue"
          />
        </PageState>
      </div>
    </DashboardLayout>
  );
};

export default Queue;
