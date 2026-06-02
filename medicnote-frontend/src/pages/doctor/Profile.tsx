import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Mail, Stethoscope, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/PageState";
import { DoctorEditDialog } from "@/components/doctor/DoctorEditDialog";
import { useApi } from "@/hooks/useApi";
import { doctorService } from "@/services/doctorService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { DoctorDTO, DoctorRequest } from "@/types/doctor.types";

const Profile: React.FC = () => {
  const { refreshUser } = useAuth();
  const { data, loading, error, refetch } = useApi<DoctorDTO>(
    () => doctorService.getMyProfile(),
    []
  );
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (req: DoctorRequest) => {
    try {
      setSubmitting(true);
      await doctorService.updateMyProfile(req);
      toast.success("Profile updated");
      setOpen(false);
      refetch();
      await refreshUser();
    } catch {
      /* interceptor already toasted */
    } finally {
      setSubmitting(false);
    }
  };

  const doctor = data;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <Button onClick={() => setOpen(true)} disabled={!doctor}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <PageState loading={loading} error={error} onRetry={refetch}>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
                {(doctor?.name || "?").charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">
                {doctor?.name || "—"}
              </h2>
              {doctor?.specialization && (
                <span className="mt-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-primary">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {doctor.specialization}
                </span>
              )}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{doctor?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-medium text-foreground">
                    {doctor?.experience ?? 0} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageState>

        <DoctorEditDialog
          doctor={doctor ?? null}
          open={open}
          onOpenChange={setOpen}
          onSubmit={handleSave}
          submitting={submitting}
        />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
