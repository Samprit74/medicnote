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
import type { PatientDTO, PatientRequest } from "@/types/patient.types";

interface Props {
  patient: PatientDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PatientRequest) => void | Promise<void>;
  submitting?: boolean;
}

const emptyForm = (): PatientRequest => ({
  name: "",
  email: "",
  age: 0,
  phone: "",
  gender: "",
  address: "",
});

export const PatientEditDialog: React.FC<Props> = ({
  patient,
  open,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState<PatientRequest>(emptyForm());

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        email: patient.email,
        age: patient.age,
        phone: patient.phone,
        gender: patient.gender,
        address: patient.address,
      });
    } else {
      setForm(emptyForm());
    }
  }, [patient, open]);

  const set = (k: keyof PatientRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: k === "age" ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={set("name")} required />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Age</Label>
              <Input type="number" min={0} value={form.age} onChange={set("age")} required />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Input value={form.gender} onChange={set("gender")} required />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={set("phone")} required />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Input value={form.address} onChange={set("address")} required />
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

export default PatientEditDialog;
