import React from "react";
import type { Prescription } from "@/types/prescription.types";
import { FileText, Eye, Download } from "lucide-react";
import { prescriptionService } from "@/services/prescriptionService";

interface Props {
  prescriptions: Prescription[];
}

const PrescriptionList: React.FC<Props> = ({ prescriptions }) => {
  const handleDownload = async (id: number) => {
    try {
      const res = await prescriptionService.download(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "prescription.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Patient
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Diagnosis
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                Date
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-4 text-sm text-muted-foreground"
                >
                  No prescriptions found
                </td>
              </tr>
            ) : (
              prescriptions.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50"
                >
                  <td className="px-5 py-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {p.patientName || p.patient?.name || "Unknown"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-foreground">
                    {p.diagnosis || "-"}
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">
                    {p.date || "-"}
                  </td>

                  <td className="px-5 py-3 text-right flex gap-2 justify-end">
                    <button className="text-primary hover:text-primary/80">
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDownload(p.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Download className="h-4 w-4" />
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