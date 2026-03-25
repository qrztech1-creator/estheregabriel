import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BackgroundMusic from "@/components/BackgroundMusic";
import EntranceGate from "@/components/EntranceGate";
import Index from "./pages/Index.tsx";
import PlaylistPage from "./pages/PlaylistPage.tsx";
import ProposalPage from "./pages/ProposalPage.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [entered, setEntered] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BackgroundMusic startPlaying={entered} />
        {!entered && <EntranceGate onEnter={() => setEntered(true)} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={entered ? <Index /> : <div className="h-screen bg-background" />} />
            <Route path="/proposta/:slug" element={<ProposalPage />} />
            <Route path="/playlist/:token" element={<PlaylistPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
