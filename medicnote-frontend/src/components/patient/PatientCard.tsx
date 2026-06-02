import React from "react";
import { User, Phone, Mail, MapPin } from "lucide-react";
import type { PatientDTO } from "@/types/patient.types";

interface Props {
  patient: PatientDTO;
  onClick?: () => void;
  highlightLastVisit?: string;
}

export const PatientCard: React.FC<Props> = ({ patient, onClick, highlightLastVisit }) => {
  const initials = (patient.name || "?").trim().charAt(0).toUpperCase();
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
          <span className="text-sm font-semibold text-primary">{initials}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{patient.name || "Unnamed"}</h4>
          <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {patient.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" /> {patient.phone}
          </div>
        )}
        {patient.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" /> {patient.email}
          </div>
        )}
        {patient.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" /> {patient.address}
          </div>
        )}
      </div>
      {highlightLastVisit && (
        <p className="mt-2 text-xs text-muted-foreground">Last visit: {highlightLastVisit}</p>
      )}
    </button>
  );
};

export default PatientCard;
