import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors closeButton position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
