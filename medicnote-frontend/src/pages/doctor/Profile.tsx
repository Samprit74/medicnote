import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MapPin, Mail, Clock, Droplets, Calendar, Stethoscope, Star } from "lucide-react";
import api from "@/services/api";

interface DoctorProfile {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experience: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: 0,
  });

  useEffect(() => {
    api
      .get("/api/doctors/me")
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          specialization: res.data.specialization,
          experience: res.data.experience,
        });
      })
      .catch((err) => {
        console.error("Profile error:", err);
        setError("Failed to load profile");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await api.put("/api/doctors/me", form);
      setProfile(res.data);
      setIsEditing(false);
      setSuccess(true);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm text-primary-foreground disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-500/10 px-4 py-2.5 text-sm text-green-600">
            Profile updated successfully!
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
              {profile.name.charAt(0)}
            </div>
            {isEditing ? (
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-4 h-10 w-full max-w-xs rounded-lg border border-input bg-background px-3 text-center text-sm font-bold"
              />
            ) : (
              <h2 className="mt-4 text-xl font-bold text-foreground">{profile.name}</h2>
            )}
            <span className="mt-1 text-sm font-medium uppercase tracking-wider text-primary">
              {profile.specialization}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Email */}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Mail className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                {isEditing ? (
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Specialization */}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Specialization</p>
                {isEditing ? (
                  <input
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.specialization}</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Star className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Experience</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                    className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{profile.experience} years</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;