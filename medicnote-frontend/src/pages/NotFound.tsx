import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/constants";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // eslint-disable-next-line no-console
  console.error("404 Error: User attempted to access non-existent route:", location.pathname);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button onClick={() => navigate(user ? dashboardPathForRole(user.role) : "/login")}>
            {user ? "Go to dashboard" : "Go to login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
