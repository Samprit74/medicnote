import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/common/SearchInput";
import { PageState } from "@/components/common/PageState";
import { CardGridSkeleton } from "@/components/common/Skeletons";
import { EmptyIllustration } from "@/components/common/EmptyIllustration";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { BookAppointmentDialog } from "@/components/appointment/BookAppointmentDialog";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { doctorService } from "@/services/doctorService";
import { Stethoscope, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Doctors: React.FC = () => {
  const { data, loading, error, refetch } = useApi(
    () => doctorService.searchDoctorsPaginated({}, 0, 50),
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minExperience, setMinExperience] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  const [bookDoctor, setBookDoctor] = useState<{ id: number; name: string } | null>(null);

  const allDoctors = data?.content ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allDoctors.forEach((d) => {
      if (d.specialization && d.specialization.trim()) set.add(d.specialization.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allDoctors]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    const minExp = minExperience === "" ? 0 : Number(minExperience);
    return allDoctors.filter((d) => {
      if (cat && (d.specialization ?? "").toLowerCase() !== cat) return false;
      if (minExp && d.experience < minExp) return false;
      if (q) {
        const name = (d.name ?? "").toLowerCase();
        const spec = (d.specialization ?? "").toLowerCase();
        if (!name.includes(q) && !spec.includes(q)) return false;
      }
      return true;
    });
  }, [allDoctors, debouncedSearch, category, minExperience]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Find a doctor</h1>
          <p className="text-sm text-muted-foreground">
            Browse specialists, filter by category, and book an appointment in one tap.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Doctor or specialization..."
              />
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All specializations</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Min experience (years)</label>
                <Input
                  type="number"
                  min={0}
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <PageState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingKind="cards"
          empty={!loading && filtered.length === 0}
          emptyTitle="No doctors match your filters"
          emptyDescription="Try clearing the search or picking a different category."
          emptyIcon={<EmptyIllustration kind="doctor" className="h-20 w-20" />}
        >
          <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {filtered.length} doctor{filtered.length === 1 ? "" : "s"} found
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DoctorCard
                key={String(d.id)}
                doctor={d}
                onBook={() => setBookDoctor({ id: Number(d.id), name: d.name })}
              />
            ))}
          </div>
        </PageState>
      </div>

      {bookDoctor && (
        <BookAppointmentDialog
          open={!!bookDoctor}
          onOpenChange={(o) => !o && setBookDoctor(null)}
          onBooked={() => {
            setBookDoctor(null);
            toast.success("Appointment booked");
          }}
          initialDoctorId={String(bookDoctor.id)}
        />
      )}
    </DashboardLayout>
  );
};

export default Doctors;
