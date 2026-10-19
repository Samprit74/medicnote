import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

  const set =
    (k: keyof DoctorRequest) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({
          ...f,
          [k]: k === "experience" ? Number(e.target.value) : e.target.value,
        }));

  if (!open) {
    return null;
  }

  return (
    <Card className="mx-auto mt-4 max-w-md rounded-xl border border-border bg-white/80 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Edit Doctor
        </CardTitle>
      </CardHeader>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(form);
        }}
        className="space-y-4"
      >
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="doctor-name">Name</Label>
            <Input
              id="doctor-name"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="doctor-email">Email</Label>
            <Input
              id="doctor-email"
              type="email"
              value={form.email}
              readOnly
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="doctor-specialization">Specialization</Label>
            <Input
              id="doctor-specialization"
              value={form.specialization}
              onChange={set("specialization")}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="doctor-experience">Experience (years)</Label>
            <Input
              id="doctor-experience"
              type="number"
              min={0}
              value={form.experience}
              onChange={set("experience")}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DoctorEditDialog;