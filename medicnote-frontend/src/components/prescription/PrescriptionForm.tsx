import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrescriptionItemEditor } from "./PrescriptionItemEditor";
import type {
  PrescriptionItemDTO,
  PrescriptionByEmailRequest,
} from "@/types/prescription.types";

interface Props {
  onSubmit: (data: PrescriptionByEmailRequest) => void | Promise<void>;
  submitting?: boolean;
}

const emptyItem = (): PrescriptionItemDTO => ({
  medicineName: "",
  dosage: "",
  frequency: "",
  duration: "",
});

export const PrescriptionForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const [patientEmail, setPatientEmail] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItemDTO[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);

  const updateItem = (idx: number) => (next: PrescriptionItemDTO) => {
    setItems((arr) => arr.map((it, i) => (i === idx ? next : it)));
  };
  const removeItem = (idx: number) => () =>
    setItems((arr) => arr.filter((_, i) => i !== idx));
  const addItem = () => setItems((arr) => [...arr, emptyItem()]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!patientEmail) {
      setError("Patient email is required.");
      return;
    }
    const cleanedItems = items
      .map((i) => ({
        ...i,
        medicineName: i.medicineName.trim(),
        dosage: i.dosage.trim(),
        frequency: i.frequency.trim(),
        duration: i.duration.trim(),
      }))
      .filter((i) => i.medicineName || i.dosage || i.frequency || i.duration);

    if (cleanedItems.length === 0) {
      setError("Add at least one medicine item.");
      return;
    }
    const hasIncomplete = cleanedItems.some(
      (i) => !i.medicineName || !i.dosage || !i.frequency || !i.duration
    );
    if (hasIncomplete) {
      setError("Every item needs medicine, dosage, frequency, and duration.");
      return;
    }

    try {
      await onSubmit({
        patientEmail: patientEmail.trim(),
        diagnosis: diagnosis.trim() || undefined,
        notes: notes.trim() || undefined,
        items: cleanedItems,
      });

      // Clear form fields on successful submission
      setPatientEmail("");
      setDiagnosis("");
      setNotes("");
      setItems([emptyItem()]);
    } catch (err) {
      console.error('Prescription submission failed', err);
      // Preserve form data on error; toast handled upstream
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Create Prescription</h3>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="email"
          placeholder="Patient Email"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
        />
        <Input
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>
      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="space-y-2">
        {items.map((it, i) => (
          <PrescriptionItemEditor
            key={i}
            item={it}
            index={i}
            onChange={updateItem(i)}
            onRemove={removeItem(i)}
            canRemove={items.length > 1}
          />
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      <Button type="submit" disabled={submitting}>
        <Save className="mr-2 h-4 w-4" />
        {submitting ? "Saving..." : "Create prescription"}
      </Button>
    </form>
  );
};

export default PrescriptionForm;
