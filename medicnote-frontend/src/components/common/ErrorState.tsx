import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({
  message = "Something went wrong.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <p className="text-sm font-medium text-foreground">Failed to load</p>
    <p className="max-w-sm text-xs">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
