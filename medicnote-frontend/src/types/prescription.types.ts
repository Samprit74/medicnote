export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  status: "active" | "completed" | "cancelled";
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  time: string;
  title: string;
  date: string;
  type: "consultation" | "examination" | "meeting" | "follow-up" | "lab-review" | "new-patient";
  color: string;
  status?: "scheduled" | "in-progress" | "completed" | "waiting";
}

export interface StatsData {
  label: string;
  value: number | string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}
