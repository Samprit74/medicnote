import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PrescriptionList from "@/components/prescription/PrescriptionList";

const PatientPrescriptions: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">My Prescriptions</h1>
      <PrescriptionList />
    </div>
  </DashboardLayout>
);

export default PatientPrescriptions;
