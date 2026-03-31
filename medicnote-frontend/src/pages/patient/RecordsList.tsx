import React from "react";

interface RecordItem {
    id: string;
    type: string;
    description: string;
    date: string;
}

interface Props {
    records: RecordItem[];
}

const RecordsList: React.FC<Props> = ({ records }) => {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="divide-y divide-border">
                {records.length === 0 ? (
                    <p className="p-5 text-sm text-muted-foreground">
                        No records found
                    </p>
                ) : (
                    records.map((r) => (
                        <div
                            key={r.id}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                    {r.type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {r.description}
                                </p>
                            </div>

                            <span className="text-xs text-muted-foreground">
                                {r.date}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecordsList;