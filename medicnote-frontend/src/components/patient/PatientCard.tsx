import React from "react";
import { User, Phone, Mail } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
}

const PatientCard: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
        <User className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{patient.name}</h4>
        <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
      </div>
    </div>
    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{patient.phone}</div>
      <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{patient.email}</div>
    </div>
    <p className="mt-2 text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
  </div>
);

export default PatientCard;
