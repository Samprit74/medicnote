import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Mail, Stethoscope, Clock, Edit, RefreshCw } from "lucide-react";
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
      await refetch();
      await refreshUser();
    } catch {
      // interceptor already handles errors
    } finally {
      setSubmitting(false);
    }
  };

  const doctor = data;

  const profileFields = [
    {
      label: "Email",
      value: doctor?.email,
      icon: Mail,
      description: "Primary contact email",
    },
    {
      label: "Specialization",
      value: doctor?.specialization,
      icon: Stethoscope,
      description: "Medical specialty",
    },
    {
      label: "Experience",
      value: doctor?.experience ? `${doctor.experience} years` : undefined,
      icon: Clock,
      description: "Years of practice",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your professional information.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refetch()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setOpen(true)} disabled={!doctor}>
              <Edit className="mr-2 h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </div>

        <PageState loading={loading} error={error} onRetry={refetch}>
          {doctor && (
            <div className="space-y-6">
              {/* Profile banner */}
              <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="h-32 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40 sm:h-40" />
                <div className="px-5 pb-6 sm:px-8">
                  <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary/10 text-3xl font-bold text-primary shadow-sm sm:h-28 sm:w-28">
                        {doctor?.name?.charAt(0) || <Stethoscope className="h-12 w-12" />}
                      </div>
                      <div className="pb-1">
                        <h2 className="text-2xl font-bold text-foreground">{doctor?.name || "Doctor"}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Doctor account</p>
                        {doctor?.email && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="break-all">{doctor.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Personal information */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Personal information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Details visible to patients and staff.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profileFields.map((field) => {
                    const Icon = field.icon;
                    const value = field.value !== null && field.value !== undefined && String(field.value).trim() !== "" ? String(field.value) : "";
                    return (
                      <div key={field.label} className="flex min-w-0 gap-4 rounded-xl border border-border/70 bg-background p-4 transition-colors hover:border-primary/30">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                          <p className="mt-1 break-words text-sm font-semibold text-foreground">{value || "Not provided"}</p>
                          {!value && <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </PageState>

        <DoctorEditDialog doctor={doctor ?? null} open={open} onOpenChange={setOpen} onSubmit={handleSave} submitting={submitting} />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
