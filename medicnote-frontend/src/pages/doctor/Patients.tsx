import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatientCard from "@/components/patient/PatientCard";
import { Search } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
}

const Patients: React.FC = () => {
  const patients: Patient[] = [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Patients</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search patients..."
              className="h-10 w-64 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patients found</p>
          ) : (
            patients.map((p) => <PatientCard key={p.id} patient={p} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;