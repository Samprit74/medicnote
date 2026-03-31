import React from "react";
import { FileText } from "lucide-react";

interface Record {
  id: string;
  date: string;
  type: string;
  description: string;
}

interface RecordsListProps {
  records?: Record[];
}

const MOCK_RECORDS: Record[] = [
  { id: "1", date: "2024-04-13", type: "Lab Report", description: "Blood test – CBC" },
  { id: "2", date: "2024-04-10", type: "Prescription", description: "Dermatitis treatment" },
  { id: "3", date: "2024-03-28", type: "Imaging", description: "Skin biopsy results" },
  { id: "4", date: "2024-03-15", type: "Lab Report", description: "Allergy panel" },
];

const RecordsList: React.FC<RecordsListProps> = ({ records = MOCK_RECORDS }) => (
  <div className="rounded-xl border border-border bg-card">
    <div className="divide-y divide-border">
      {records.map((r) => (
        <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{r.type}</p>
            <p className="text-xs text-muted-foreground">{r.description}</p>
          </div>
          <span className="text-xs text-muted-foreground">{r.date}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RecordsList;
