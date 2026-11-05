import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeniorModeProvider } from "@/contexts/SeniorModeContext";
import { AppLayout } from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import SimulatorPage from "@/pages/SimulatorPage";
import AssistantPage from "@/pages/AssistantPage";
import FinancialPage from "@/pages/FinancialPage";
import DigiLockerPage from "@/pages/DigiLockerPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SeniorModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/digilocker" element={<DigiLockerPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SeniorModeProvider>
  </QueryClientProvider>
);

export default App;
