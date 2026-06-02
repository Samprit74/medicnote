import React from "react";
import { Stethoscope, BadgeCheck } from "lucide-react";
import type { DoctorDTO } from "@/types/doctor.types";

interface Props {
  doctor: DoctorDTO;
  onBook?: () => void;
}

export const DoctorCard: React.FC<Props> = ({ doctor, onBook }) => {
  const initials = (doctor.name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
          <span className="text-sm font-semibold text-primary">{initials}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">{doctor.name}</h4>
          <p className="text-xs uppercase tracking-wider text-primary">
            {doctor.specialization}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <BadgeCheck className="h-3.5 w-3.5" />
          {doctor.experience}+ yrs exp.
        </div>
        {onBook && (
          <button
            onClick={onBook}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
