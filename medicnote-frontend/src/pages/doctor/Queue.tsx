
import React, { useCallback, useState } from "react";
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

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
      }
    ).response;

    if (response?.status === 400) {
      return response.data?.message || "Invalid request. Please check the appointment status.";
    }

    if (response?.status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (response?.status === 403) {
      return "You are not authorized to complete this appointment.";
    }

    if (response?.status === 404) {
      return "Appointment not found. Refresh the queue and try again.";
    }

    if (response?.status === 409) {
      return response.data?.message || "This appointment has already been updated.";
    }

    if (response?.status === 422) {
      return response.data?.message || "This appointment cannot be completed in its current state.";
    }

    if (response?.status && response.status >= 500) {
      return "The server encountered an error. Please try again later.";
    }

    if (response?.data?.message || response?.data?.error) {
      return response.data.message || response.data.error || "The request failed.";
    }
  }

  if (typeof error === "object" && error !== null && "request" in error) {
    return "Unable to reach the server. Check your internet connection and try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const Queue: React.FC = () => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useApi<AppointmentDTO[]>(
    () => appointmentService.getDoctorQueue(),
    []
  );

  const [completingIds, setCompletingIds] = useState<Set<string>>(
    () => new Set()
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleComplete = useCallback(
    async (id: AppointmentDTO["id"]) => {
      const key = String(id);

      if (completingIds.has(key)) {
        return;
      }

      setCompletingIds((previous) => new Set(previous).add(key));

      try {
        await appointmentService.updateStatus(id, "COMPLETED");

        toast.success("Appointment marked as completed.");

        try {
          await refetch();
        } catch {
          toast.error(
            "The appointment was completed, but the queue could not refresh. Use Refresh to reload it."
          );
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        setCompletingIds((previous) => {
          const next = new Set(previous);
          next.delete(key);
          return next;
        });
      }
    },
    [completingIds, refetch]
  );

  const handleRefresh = useCallback(async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      await refetch();
    } catch (error: unknown) {
      toast.error(`Failed to refresh the queue: ${getErrorMessage(error)}`);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Patient Queue
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage waiting appointments and update their status.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleRefresh()}
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${loading || refreshing ? "animate-spin" : ""
                }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingKind="table"
          empty={!loading && !error && (data?.length ?? 0) === 0}
          emptyTitle="Queue is clear!"
          emptyDescription="No patients waiting. See you at the next one."
          emptyIcon={
            <EmptyIllustration
              kind="queue"
              className="h-20 w-20"
            />
          }
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
