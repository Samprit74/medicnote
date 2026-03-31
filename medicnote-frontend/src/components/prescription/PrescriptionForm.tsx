import React, { useState } from "react";
import type { Medication } from "@/types/prescription.types";

const PrescriptionForm: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const updateMedication = (i: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[i] = { ...updated[i], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = () => {
    const payload = {
      patientName,
      diagnosis,
      notes,
      medications,
    };

    console.log(payload);
  };

  return (
    <form className="space-y-6 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">New Prescription</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
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
          <h3 className="text-sm font-semibold text-foreground">Medications</h3>
          <button type="button" onClick={addMedication} className="text-sm text-primary">
            + Add
          </button>
        </div>

        {medications.map((med, i) => (
          <div key={i} className="mb-3 grid gap-3 md:grid-cols-4">
            {(["name", "dosage", "frequency", "duration"] as const).map((field) => (
              <input
                key={field}
                placeholder={field}
                value={med[field]}
                onChange={(e) => updateMedication(i, field, e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            ))}
          </div>
        ))}
      </div>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-lg border border-input p-3 text-sm"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm text-primary-foreground"
      >
        Save Prescription
      </button>
    </form>
  );
};

export default PrescriptionForm;