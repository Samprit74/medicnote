
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Edit,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
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

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi<PatientDTO>(() => patientService.getProfile(), []);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (request: PatientRequest) => {
    try {
      setSubmitting(true);

      await patientService.updateProfile(request);

      toast.success("Profile updated successfully");
      setOpen(false);

      await refetch();
      await refreshUser();
    } catch {
      // The API interceptor handles error notifications.
    } finally {
      setSubmitting(false);
    }
  };

  const fullName = data?.name?.trim() || "Patient";
  const initials =
    fullName === "Patient"
      ? "P"
      : fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

  const profileFields = [
    {
      label: "Email address",
      value: data?.email,
      icon: Mail,
      description: "Your registered email address",
    },
    {
      label: "Phone number",
      value: data?.phone,
      icon: Phone,
      description: "Your contact number",
    },
    {
      label: "Age",
      value:
        data?.age !== null && data?.age !== undefined
          ? `${data.age} years`
          : undefined,
      icon: CalendarDays,
      description: "Your age",
    },
    {
      label: "Gender",
      value: data?.gender,
      icon: UserRound,
      description: "Your gender information",
    },
    {
      label: "Address",
      value: data?.address,
      icon: MapPin,
      description: "Your residential address",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal information and contact details.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button onClick={() => setOpen(true)} disabled={!data || submitting}>
              <Edit className="mr-2 h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </div>

        <PageState loading={loading} error={error} onRetry={refetch}>
          {data && (
            <div className="space-y-6">
              {/* Profile banner */}
              <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="h-32 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40 sm:h-40" />

                <div className="px-5 pb-6 sm:px-8">
                  <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary/10 text-3xl font-bold text-primary shadow-sm sm:h-28 sm:w-28">
                        {initials || (
                          <UserRound className="h-12 w-12" />
                        )}
                      </div>

                      <div className="pb-1">
                        <h2 className="text-2xl font-bold text-foreground">
                          {fullName}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Patient account
                        </p>

                        {data.email && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="break-all">{data.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setOpen(true)}
                      disabled={submitting}
                      className="sm:mb-1"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Update details
                    </Button>
                  </div>
                </div>
              </section>

              {/* Personal information */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Personal information
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your personal details associated with this account.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {profileFields.map((field) => {
                    const Icon = field.icon;
                    const value =
                      field.value !== null &&
                        field.value !== undefined &&
                        String(field.value).trim() !== ""
                        ? String(field.value)
                        : "";

                    return (
                      <div
                        key={field.label}
                        className="flex min-w-0 gap-4 rounded-xl border border-border/70 bg-background p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {field.label}
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold text-foreground">
                            {value || "Not provided"}
                          </p>

                          {!value && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Keep your profile up to date
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Update your contact details whenever they change.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setOpen(true)}
                    disabled={submitting}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit details
                  </Button>
                </div>
              </section>

              {/* Account information */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      Account information
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Your profile information is used to help associate your
                      account with your healthcare records. Make sure your
                      information is accurate.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
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
