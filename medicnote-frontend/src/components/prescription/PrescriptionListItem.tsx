import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { PrescriptionDTO } from "@/types/prescription.types";
import { prescriptionService } from "@/services/prescriptionService";
import { toast } from "sonner";

interface Props {
  p: PrescriptionDTO;
  onView: (p: PrescriptionDTO) => void;
}

export const PrescriptionListItem: React.FC<Props> = ({ p, onView }) => {
  const handleDownload = async () => {
    try {
      const res = await prescriptionService.download(p.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${p.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      /* interceptor already toasted */
    }
  };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/50">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{p.patientName || "—"}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-foreground">{p.diagnosis || "—"}</td>
      <td className="px-5 py-3 text-muted-foreground">{formatDate(p.date)}</td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(p)}
            aria-label="View prescription"
            className="text-primary hover:text-primary/80"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            aria-label="Download PDF"
            className="text-primary hover:text-primary/80"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default PrescriptionListItem;
