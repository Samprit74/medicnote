import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecordsList from "@/components/patient/RecordsList";

const Records: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Medical Records</h1>
      <RecordsList />
    </div>
  </DashboardLayout>
);

export default Records;
