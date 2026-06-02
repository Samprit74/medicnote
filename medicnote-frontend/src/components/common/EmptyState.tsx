import React from "react";
import { Inbox } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({
  title = "Nothing here yet",
  description,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      {icon ?? <Inbox className="h-5 w-5" />}
    </div>
    <p className="text-sm font-medium text-foreground">{title}</p>
    {description && <p className="max-w-sm text-xs">{description}</p>}
  </div>
);

export default EmptyState;
