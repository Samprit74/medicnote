import React, { useState } from "react";

interface PrescriptionFormProps {
  onSubmit: (data: any) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    appointmentId: "",
    diagnosis: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.appointmentId) return;

    onSubmit({
      appointmentId: Number(form.appointmentId),
      diagnosis: form.diagnosis,
      notes: form.notes,
      items: [],
    });

    setForm({
      appointmentId: "",
      diagnosis: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border p-4">
      <h3 className="text-sm font-semibold">Create Prescription</h3>

      <input
        name="appointmentId"
        value={form.appointmentId}
        onChange={handleChange}
        placeholder="Appointment ID"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <input
        name="diagnosis"
        value={form.diagnosis}
        onChange={handleChange}
        placeholder="Diagnosis"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-white text-sm"
      >
        Create
      </button>
    </form>
  );
};

export default PrescriptionForm;