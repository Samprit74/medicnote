import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Mail, Phone, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/common/PageState";
import { PatientEditDialog } from "@/components/patient/PatientEditDialog";
import { useApi } from "@/hooks/useApi";
import { patientService } from "@/services/patientService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { PatientDTO, PatientRequest } from "@/types/patient.types";

const Profile: React.FC = () => {
  const { refreshUser } = useAuth();
  const { data, loading, error, refetch } = useApi<PatientDTO>(
    () => patientService.getProfile(),
    []
  );
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (req: PatientRequest) => {
    try {
      setSubmitting(true);
      await patientService.updateProfile(req);
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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <Button onClick={() => setOpen(true)} disabled={!data}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <PageState loading={loading} error={error} onRetry={refetch}>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
                {(data?.name || "?").charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{data?.name}</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{data?.email}</p>
                </div>
              </div>
              {data?.phone && (
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{data.phone}</p>
                  </div>
                </div>
              )}
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-medium text-foreground">{data?.age}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="text-sm font-medium text-foreground">{data?.gender}</p>
              </div>
              {data?.address && (
                <div className="rounded-lg bg-muted p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{data.address}</p>
                </div>
              )}
            </div>
          </div>
        </PageState>

        <PatientEditDialog
          patient={data ?? null}
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
