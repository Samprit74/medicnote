import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Mail, Clock, Droplets, Calendar } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
              {user.name.charAt(0)}
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">{user.name}</h2>
            {user.specialization && (
              <span className="mt-1 text-sm font-medium uppercase tracking-wider text-primary">{user.specialization}</span>
            )}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {user.location && (
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium text-foreground">{user.location}</p></div>
              </div>
            )}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Mail className="h-5 w-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium text-foreground">{user.email}</p></div>
            </div>
            {user.dateOfBirth && (
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="text-sm font-medium text-foreground">{user.dateOfBirth}</p></div>
              </div>
            )}
            {user.bloodGroup && (
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Droplets className="h-5 w-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Blood Group</p><p className="text-sm font-medium text-foreground">{user.bloodGroup}</p></div>
              </div>
            )}
            {user.workingHours && (
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">Working Hours</p><p className="text-sm font-medium text-foreground">{user.workingHours}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
