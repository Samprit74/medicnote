import React from "react";
import type { User } from "@/types/user.types";
import { MapPin, Edit } from "lucide-react";
import { Float } from "@/components/common/Float";

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const initials = (user.name || "?")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">MY PROFILE</h3>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105">
          <Edit className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <Float speed="slower">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary ring-2 ring-primary/20">
            {initials}
          </div>
        </Float>
        <h4 className="mt-3 text-base font-semibold text-foreground">{user.name}</h4>
        {user.specialization && (
          <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-primary">
            {user.specialization}
          </span>
        )}
        {user.location && (
          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {user.location}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {user.dateOfBirth && (
          <div>
            <p className="text-[10px] text-muted-foreground">Date Birth</p>
            <p className="text-sm font-semibold text-foreground">{user.dateOfBirth}</p>
          </div>
        )}
        {user.bloodGroup && (
          <div>
            <p className="text-[10px] text-muted-foreground">Blood</p>
            <p className="text-sm font-semibold text-foreground">{user.bloodGroup}</p>
          </div>
        )}
        {user.workingHours && (
          <div>
            <p className="text-[10px] text-muted-foreground">Working Hours</p>
            <p className="text-sm font-semibold text-foreground">{user.workingHours}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
