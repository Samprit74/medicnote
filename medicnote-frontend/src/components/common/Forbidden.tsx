import React from "react";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export const Forbidden: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const path = user ? dashboardPathForRole(user.role) : "/login";
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldOff className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page
          {user ? ` as ${user.role}.` : "."}
        </p>
        <Button className="mt-6" onClick={() => navigate(path)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to your dashboard
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;
