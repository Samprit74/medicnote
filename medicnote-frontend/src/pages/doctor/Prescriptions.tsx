import React, { useState } from "react";
import api from "@/services/api";

interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Props {
  onSuccess?: () => void;
}

const PrescriptionForm: React.FC<Props> = ({ onSuccess }) => {
  const [appointmentId, setAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([
    { medicineName: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addItem = () => {
    setItems([...items, { medicineName: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeItem = (i: number) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await api.post("/api/prescriptions", {
        appointmentId: Number(appointmentId),
        diagnosis,
        notes,
        items,
      });

      setSuccess(true);
      setAppointmentId("");
      setDiagnosis("");
      setNotes("");
      setItems([{ medicineName: "", dosage: "", frequency: "", duration: "" }]);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to save prescription";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">New Prescription</h2>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-500/10 px-4 py-2.5 text-sm text-green-600">
          Prescription saved successfully!
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <input
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        <input
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Medicines</h3>
          <button type="button" onClick={addItem} className="text-sm text-primary">
            + Add Medicine
          </button>
        </div>

        {items.map((item, i) => (
          <div key={i} className="mb-3 flex gap-3 items-center">
            <div className="grid flex-1 gap-3 md:grid-cols-4">
              <input
                placeholder="Medicine Name"
                value={item.medicineName}
                onChange={(e) => updateItem(i, "medicineName", e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                placeholder="Dosage (500mg)"
                value={item.dosage}
                onChange={(e) => updateItem(i, "dosage", e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                placeholder="Frequency (3x daily)"
                value={item.frequency}
                onChange={(e) => updateItem(i, "frequency", e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                placeholder="Duration (5 days)"
                value={item.duration}
                onChange={(e) => updateItem(i, "duration", e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs text-destructive hover:text-destructive/80"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-input p-3 text-sm"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Prescription"}
      </button>
    </div>
  );
};

export default PrescriptionForm;