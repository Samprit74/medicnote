
import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/common/SearchInput";
import { PageState } from "@/components/common/PageState";
import { EmptyIllustration } from "@/components/common/EmptyIllustration";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { BookAppointmentDialog } from "@/components/appointment/BookAppointmentDialog";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { doctorService } from "@/services/doctorService";
import { Search, Sparkles, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Doctors: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minExperience, setMinExperience] = useState("");

  const [appliedFilters, setAppliedFilters] = useState<{
    specialization?: string;
    experience?: number;
  }>({});

  const [bookDoctor, setBookDoctor] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(
    () => {
      if (
        appliedFilters.specialization ||
        appliedFilters.experience !== undefined
      ) {
        return doctorService.searchDoctors(appliedFilters);
      }

      return doctorService.getAllDoctors();
    },
    [appliedFilters]
  );

  const allDoctors = data ?? [];

  const categories = useMemo(() => {
    const specializationSet = new Set<string>();

    allDoctors.forEach((doctor) => {
      const specialization = doctor.specialization?.trim();

      if (specialization) {
        specializationSet.add(specialization);
      }
    });

    return Array.from(specializationSet).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [allDoctors]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const selectedCategory = category.trim().toLowerCase();

    const minimumExperience =
      minExperience.trim() === "" ? undefined : Number(minExperience);

    return allDoctors.filter((doctor) => {
      const name = (doctor.name ?? "").toLowerCase();
      const specialization = (
        doctor.specialization ?? ""
      ).toLowerCase();

      const experience = Number(doctor.experience ?? 0);

      if (
        selectedCategory &&
        specialization !== selectedCategory
      ) {
        return false;
      }

      if (
        minimumExperience !== undefined &&
        Number.isFinite(minimumExperience) &&
        experience < minimumExperience
      ) {
        return false;
      }

      if (
        query &&
        !name.includes(query) &&
        !specialization.includes(query)
      ) {
        return false;
      }

      return true;
    });
  }, [allDoctors, debouncedSearch, category, minExperience]);

  const applyFilters = () => {
    const experience =
      minExperience.trim() === ""
        ? undefined
        : Number(minExperience);

    if (
      experience !== undefined &&
      (!Number.isFinite(experience) || experience < 0)
    ) {
      toast.error("Enter a valid minimum experience.");
      return;
    }

    setAppliedFilters({
      specialization: category || undefined,
      experience,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinExperience("");
    setAppliedFilters({});
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page header */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-10 sm:px-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-sm text-primary">
              <Stethoscope className="h-4 w-4" />
              Your health, our priority
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Find Your Doctor
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Discover the right doctor for your needs. Search by name,
              explore specializations, and find a professional who suits
              your requirements.
            </p>
          </div>

          <Stethoscope
            aria-hidden="true"
            className="absolute -bottom-8 -right-5 h-40 w-40 text-primary/10 sm:h-52 sm:w-52"
          />
        </section>

        {/* Search and filters */}
        <Card className="overflow-hidden rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" />
              Search and filter doctors
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Doctor name
                </label>

                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name or specialty..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Specialization
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">All specializations</option>

                  {categories.map((specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                    >
                      {specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Minimum experience
                </label>

                <Input
                  type="number"
                  min={0}
                  value={minExperience}
                  onChange={(event) =>
                    setMinExperience(event.target.value)
                  }
                  placeholder="Any experience"
                />

                <p className="text-xs text-muted-foreground">
                  Minimum years of professional experience
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={applyFilters} className="gap-2">
                <Search className="h-4 w-4" />
                Apply filters
              </Button>

              <Button
                variant="outline"
                onClick={resetFilters}
              >
                Reset filters
              </Button>

              <span className="text-sm text-muted-foreground">
                {filtered.length} doctor
                {filtered.length === 1 ? "" : "s"} found
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Doctor directory */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Available doctors
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Browse the directory and select a doctor to book an
                appointment.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Personalized search</span>
            </div>
          </div>

          <PageState
            loading={loading}
            error={error}
            onRetry={refetch}
            loadingKind="cards"
            empty={!loading && filtered.length === 0}
            emptyTitle="No doctors found"
            emptyDescription="Try another search term or reset your filters to see more doctors."
            emptyIcon={
              <EmptyIllustration
                kind="doctor"
                className="h-20 w-20"
              />
            }
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((doctor) => (
                <DoctorCard
                  key={String(doctor.id)}
                  doctor={doctor}
                  onBook={() => {
                    if (doctor.id == null) {
                      toast.error(
                        "This doctor's ID is unavailable. Please try again."
                      );
                      return;
                    }

                    setBookDoctor({
                      id: Number(doctor.id),
                      name: doctor.name ?? "Selected doctor",
                    });
                  }}
                />
              ))}
            </div>
          </PageState>
        </section>

        {/* Appointment dialog */}
        {bookDoctor && (
          <BookAppointmentDialog
            open={Boolean(bookDoctor)}
            onOpenChange={(open) => {
              if (!open) {
                setBookDoctor(null);
              }
            }}
            onBooked={() => {
              setBookDoctor(null);
              toast.success("Appointment booked successfully.");
              refetch();
            }}
            initialDoctorId={String(bookDoctor.id)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
