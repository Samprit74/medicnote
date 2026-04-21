import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatientCard from "@/components/patient/PatientCard";
import { Search } from "lucide-react";
import api from "@/services/api";

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
  address: string;
  lastVisit: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = useCallback(async (search: string) => {
    setIsLoading(true);
    setError("");
    try {
      const url = search
        ? `/api/patients/doctor/me/search?q=${search}`
        : `/api/patients/doctor/me`;
      const res = await api.get(url);

      // Handle both array and wrapped object response
      const data = res.data;
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setPatients(data.content); // Spring Page object
      } else if (data?.patients && Array.isArray(data.patients)) {
        setPatients(data.patients);
      } else if (data?.data && Array.isArray(data.data)) {
        setPatients(data.data);
      } else {
        setPatients([]);
        console.log("API response:", data); // check console to see actual shape
      }
    } catch (err) {
      console.error("Patients error:", err);
      setError("Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients("");
  }, [fetchPatients]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPatients(query), 400);
    return () => clearTimeout(timer);
  }, [query, fetchPatients]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Patients</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search patients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-64 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading patients...</p>
          ) : patients.length === 0 ? (
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