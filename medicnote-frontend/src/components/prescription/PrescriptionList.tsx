import React, { useState } from "react";
import type { PrescriptionDTO } from "@/types/prescription.types";
import { PrescriptionListItem } from "./PrescriptionListItem";
import { PrescriptionDetailDialog } from "./PrescriptionDetailDialog";

interface Props {
  prescriptions: PrescriptionDTO[];
  emptyLabel?: string;
}

export const PrescriptionList: React.FC<Props> = ({
  prescriptions,
  emptyLabel = "No prescriptions found",
}) => {
  const [open, setOpen] = useState<PrescriptionDTO | null>(null);

  return (
    <>
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
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                prescriptions.map((p) => (
                  <PrescriptionListItem key={String(p.id)} p={p} onView={setOpen} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrescriptionDetailDialog prescription={open} onClose={() => setOpen(null)} />
    </>
  );
};

export default PrescriptionList;
