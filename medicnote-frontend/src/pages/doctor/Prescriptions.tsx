import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";
import PrescriptionList from "@/components/prescription/PrescriptionList";
import { prescriptionService } from "@/services/prescriptionService";

const DoctorPrescriptions: React.FC = () => {
  const [patientId, setPatientId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchByPatient = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const res = await prescriptionService.getByPatient(Number(patientId));
      setPrescriptions(res.data.content || []);
    } catch (err) {
      console.error(err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByDate = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const res = await prescriptionService.getByDate(date);
      setPrescriptions(res.data.content || []);
    } catch (err) {
      console.error(err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await prescriptionService.create(data);
      alert("Prescription created");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Prescriptions</h1>

        {/* CREATE */}
        <PrescriptionForm onSubmit={handleCreate} />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            value={patientId}
            onChange={(e) =>
              setPatientId(e.target.value ? Number(e.target.value) : "")
            }
            placeholder="Patient ID"
            className="rounded border px-3 py-2 text-sm"
          />

          <button
            onClick={fetchByPatient}
            className="rounded bg-primary px-4 py-2 text-white text-sm"
          >
            Get by Patient
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          />

          <button
            onClick={fetchByDate}
            className="rounded bg-primary px-4 py-2 text-white text-sm"
          >
            Get by Date
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No prescriptions found
          </p>
        ) : (
          <PrescriptionList prescriptions={prescriptions} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;