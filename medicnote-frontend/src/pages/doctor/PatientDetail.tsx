import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import api from "@/services/api";

interface PatientDetail {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
  address: string;
}

const PatientDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Doctor's patients list la irundhu id match pannrom
    api
      .get(`/api/patients/doctor/me`)
      .then((res) => {
        const data = res.data;
        let patients: PatientDetail[] = [];
        if (Array.isArray(data)) {
          patients = data;
        } else if (data?.content) {
          patients = data.content;
        }
        const found = patients.find((p) => String(p.id) === String(id));
        if (found) {
          setPatient(found);
        } else {
          setError("Patient not found");
        }
      })
      .catch(() => setError("Failed to load patient details"))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <button
          onClick={() => navigate("/doctor/patients")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </button>

        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {patient && (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
                {patient.name.charAt(0)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{patient.name}</h2>
              <span className="mt-1 text-sm text-muted-foreground">
                {patient.gender} • {patient.age} yrs
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3 sm:col-span-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{patient.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;