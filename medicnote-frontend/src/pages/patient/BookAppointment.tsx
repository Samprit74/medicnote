import React, { useEffect, useState } from "react";
import { Calendar, User, CheckCircle } from "lucide-react";
import api from "@/services/api";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
}

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // All doctors load pannrom
  useEffect(() => {
    api
      .get("/api/doctors")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data?.content) {
          setDoctors(data.content);
        }
      })
      .catch(() => setError("Failed to load doctors"))
      .finally(() => setIsLoadingDoctors(false));
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor || !appointmentDate) {
      setError("Doctor and date select pannunga");
      return;
    }

    setError("");
    setIsLoading(true);
    setSuccess(false);

    try {
      await api.post("/api/appointments", {
        doctorId: Number(selectedDoctor),
        appointmentDate: appointmentDate,
      });
      setSuccess(true);
      setSelectedDoctor("");
      setAppointmentDate("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to book appointment";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Today's date minimum
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Book Appointment</h2>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Appointment booked successfully!
        </div>
      )}

      {/* Doctor Select */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-4 w-4 text-primary" />
          Select Doctor
        </label>
        {isLoadingDoctors ? (
          <p className="text-sm text-muted-foreground">Loading doctors...</p>
        ) : (
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} — {d.specialization} ({d.experience} yrs)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Date Picker */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          Appointment Date
        </label>
        <input
          type="date"
          value={appointmentDate}
          min={today}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        onClick={handleBook}
        disabled={isLoading || !selectedDoctor || !appointmentDate}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default BookAppointment;