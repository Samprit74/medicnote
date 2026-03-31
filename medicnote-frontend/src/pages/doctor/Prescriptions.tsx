import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PrescriptionForm from "@/components/prescription/PrescriptionForm";
import PrescriptionList from "@/components/prescription/PrescriptionList";
import type { Prescription } from "@/types/prescription.types";

const Prescriptions: React.FC = () => {
  const prescriptions: Prescription[] = [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">Prescriptions</h1>
        <PrescriptionForm />
        <PrescriptionList prescriptions={prescriptions} />
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;