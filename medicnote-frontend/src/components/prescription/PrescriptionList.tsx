import React from "react";
import type { Prescription } from "@/types/prescription.types";
import { FileText, Eye } from "lucide-react";

interface Props {
  prescriptions: Prescription[];
}

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

const PrescriptionList: React.FC<Props> = ({ prescriptions }) => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Patient</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Diagnosis</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-sm text-muted-foreground">
                  No prescriptions found
                </td>
              </tr>
            ) : (
              prescriptions.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-medium">{p.patientName}</span>
                  </td>
                  <td className="px-5 py-3 text-foreground">{p.diagnosis}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-primary hover:text-primary/80">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionList;