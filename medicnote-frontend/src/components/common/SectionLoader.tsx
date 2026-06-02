import React from "react";
import { Loader2 } from "lucide-react";

export const SectionLoader: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>{label}</span>
  </div>
);

export default SectionLoader;
