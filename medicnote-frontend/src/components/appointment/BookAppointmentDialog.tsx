import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatters";
import { SectionLoader } from "@/components/common/SectionLoader";
import { Search } from "lucide-react";
import type { DoctorDTO } from "@/types/doctor.types";
import type { AvailabilitySlot } from "@/types/appointment.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked?: () => void;
  /** When set, the dialog opens with this doctor pre-selected. */
  initialDoctorId?: string;
}

export const BookAppointmentDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onBooked,
  initialDoctorId,
}) => {
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [doctorId, setDoctorId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // category / specialization filter
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingDoctors(true);
    doctorService
      .getAllDoctors()
      .then((r) => setDoctors(r.data))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, [open]);

  // Pre-select the requested doctor whenever the dialog opens.
  useEffect(() => {
    if (open && initialDoctorId) {
      setDoctorId(initialDoctorId);
    }
  }, [open, initialDoctorId]);

  // Build the filtered list when category / search / doctors change.
  const filteredDoctors = useMemo(() => {
    const cat = category.trim().toLowerCase();
    const q = search.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesCat = cat
        ? (d.specialization ?? "").toLowerCase().includes(cat)
        : true;
      const matchesQ = q
        ? (d.name ?? "").toLowerCase().includes(q) ||
          (d.specialization ?? "").toLowerCase().includes(q)
        : true;
      return matchesCat && matchesQ;
    });
  }, [doctors, category, search]);

  // Available specializations for the category dropdown (sorted, deduped).
  const categories = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => {
      if (d.specialization && d.specialization.trim()) {
        set.add(d.specialization.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  useEffect(() => {
    if (!doctorId) {
      setAvailability([]);
      return;
    }
    setLoadingSlots(true);
    appointmentService
      .getAvailability(doctorId)
      .then((r) => setAvailability(r.data))
      .catch(() => setAvailability([]))
      .finally(() => setLoadingSlots(false));
  }, [doctorId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!doctorId || !date) {
      setErr("Select a doctor and a date.");
      return;
    }
    try {
      setSubmitting(true);
      await appointmentService.bookAppointment({
        doctorId: Number(doctorId),
        appointmentDate: date,
      });
      toast.success("Appointment booked");
      onBooked?.();
      onOpenChange(false);
      setDoctorId("");
      setDate("");
      setCategory("");
      setSearch("");
    } catch {
      /* interceptor already toasted */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book an appointment</DialogTitle>
          <DialogDescription>
            Pick a category, then choose a doctor and a date. The system assigns
            you a queue slot automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBook} className="space-y-3">
          {err && <p className="text-xs text-destructive">{err}</p>}

          {/* Category / specialization filter */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setDoctorId("");
                  setDate("");
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
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
              <Label>Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDoctorId("");
                    setDate("");
                  }}
                  placeholder="Doctor or specialization"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Doctor</Label>
            {loadingDoctors ? (
              <SectionLoader label="Loading doctors..." />
            ) : filteredDoctors.length === 0 ? (
              <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                No doctors match this filter.
              </p>
            ) : (
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Select a doctor</option>
                {filteredDoctors.map((d) => (
                  <option key={String(d.id)} value={String(d.id)}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {doctorId && (
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Availability (next 2 weeks)
              </p>
              {loadingSlots ? (
                <SectionLoader label="Checking slots..." />
              ) : availability.filter((s) => s.availableSlots > 0).length === 0 ? (
                <p className="text-xs text-muted-foreground">No slots available.</p>
              ) : (
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {availability
                    .filter((s) => s.availableSlots > 0)
                    .map((s) => (
                      <button
                        key={s.date}
                        type="button"
                        onClick={() => setDate(s.date)}
                        className={`rounded-md border px-2 py-1 text-xs ${
                          date === s.date
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {formatDate(s.date)} ({s.availableSlots} left)
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Book appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;
