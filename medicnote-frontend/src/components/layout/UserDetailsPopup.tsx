import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const UserDetailsPopup: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-foreground">
          <span className="hidden text-sm font-medium md:block">
            {user?.name}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user?.name?.charAt(0) ?? "U"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4" sideOffset={8} align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => {
            const role = user?.role?.toLowerCase();
            if (role === "doctor") navigate("/doctor/profile");
            else if (role === "patient") navigate("/patient/profile");
            else navigate("/");
          }}>
            View Profile
          </Button>
          <Button variant="destructive" size="sm" className="mt-2 w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
