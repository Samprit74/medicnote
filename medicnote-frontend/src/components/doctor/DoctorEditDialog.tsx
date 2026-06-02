import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DoctorDTO, DoctorRequest } from "@/types/doctor.types";

interface Props {
  doctor: DoctorDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DoctorRequest) => void | Promise<void>;
  submitting?: boolean;
}

const empty = (): DoctorRequest => ({
  name: "",
  email: "",
  specialization: "",
  experience: 0,
});

export const DoctorEditDialog: React.FC<Props> = ({
  doctor,
  open,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState<DoctorRequest>(empty());

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
      });
    } else {
      setForm(empty());
    }
  }, [doctor, open]);

  const set = (k: keyof DoctorRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: k === "experience" ? Number(e.target.value) : e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit doctor</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(form);
          }}
          className="space-y-3"
        >
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={set("name")} required />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="space-y-1">
            <Label>Specialization</Label>
            <Input value={form.specialization} onChange={set("specialization")} required />
          </div>
          <div className="space-y-1">
            <Label>Experience (years)</Label>
            <Input
              type="number"
              min={0}
              value={form.experience}
              onChange={set("experience")}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorEditDialog;
