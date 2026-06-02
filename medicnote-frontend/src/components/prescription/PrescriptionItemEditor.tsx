import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PrescriptionItemDTO } from "@/types/prescription.types";

interface Props {
  item: PrescriptionItemDTO;
  index: number;
  onChange: (next: PrescriptionItemDTO) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const PrescriptionItemEditor: React.FC<Props> = ({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}) => {
  const set = (k: keyof PrescriptionItemDTO) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...item, [k]: e.target.value });

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Item {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onRemove}
            aria-label="Remove item"
            className="h-7 w-7 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          placeholder="Medicine name"
          value={item.medicineName}
          onChange={set("medicineName")}
        />
        <Input placeholder="Dosage (e.g. 500mg)" value={item.dosage} onChange={set("dosage")} />
        <Input placeholder="Frequency (e.g. 1-0-1)" value={item.frequency} onChange={set("frequency")} />
        <Input placeholder="Duration (e.g. 5 days)" value={item.duration} onChange={set("duration")} />
      </div>
    </div>
  );
};

export default PrescriptionItemEditor;
