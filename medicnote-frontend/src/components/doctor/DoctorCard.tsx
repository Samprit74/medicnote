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
    <div className="relative rounded-2xl bg-white/20 backdrop-blur-xl border border-primary/30 p-6 shadow-lg transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 group">
      {/* Gradient border accent */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/30">
          <span className="text-lg font-semibold text-primary">{initials}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-foreground">{doctor.name}</h4>
          <p className="text-sm uppercase tracking-wider text-primary/80">
            {doctor.specialization}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground relative z-10">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <span>{doctor.experience}+ yrs exp.</span>
        </div>
        {onBook && (
          <button
            onClick={onBook}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;

