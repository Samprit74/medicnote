import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/services/api";

interface PrescriptionItemResponseDTO {
  id: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionResponseDTO {
  id: number;
  date: string;
  diagnosis: string;
  notes: string;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  items: PrescriptionItemResponseDTO[];
}

const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get("/api/prescriptions/patient/me")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPrescriptions(data);
        } else if (data?.content && Array.isArray(data.content)) {
          setPrescriptions(data.content);
        } else {
          setPrescriptions([]);
          console.log("Prescriptions response:", data);
        }
      })
      .catch((err) => {
        console.error("Prescriptions error:", err);
        setError("Failed to load prescriptions");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-foreground">My Prescriptions</h1>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No prescriptions found</p>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card">
                {/* Header */}
                <div
                  className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-muted/50"
                  onClick={() => toggleExpand(p.id)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Dr. {p.doctorName}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.diagnosis}</p>
                  </div>

                  <span className="text-xs text-muted-foreground">{p.date}</span>

                  {expandedId === p.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Expanded Medicine Details */}
                {expandedId === p.id && (
                  <div className="border-t border-border px-5 py-4 space-y-4">
                    {/* Notes */}
                    {p.notes && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground">{p.notes}</p>
                      </div>
                    )}

                    {/* Medicines Table */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Medicines</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Medicine</th>
                              <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Dosage</th>
                              <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Frequency</th>
                              <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.items.map((item) => (
                              <tr key={item.id} className="border-b border-border last:border-0">
                                <td className="py-2 font-medium text-foreground">{item.medicineName}</td>
                                <td className="py-2 text-muted-foreground">{item.dosage}</td>
                                <td className="py-2 text-muted-foreground">{item.frequency}</td>
                                <td className="py-2 text-muted-foreground">{item.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescriptions;