import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, List, BarChart3 } from "lucide-react";
import logo from "@/assets/logo-homemusic.png";
import { Button } from "@/components/ui/button";
import ProposalList from "@/components/admin/ProposalList";
import ProposalForm from "@/components/admin/ProposalForm";
import ProposalResponses from "@/components/admin/ProposalResponses";
import ProposalDetail from "@/components/admin/ProposalDetail";
import ProposalEditForm from "@/components/admin/ProposalEditForm";
import ProposalHistory from "@/components/admin/ProposalHistory";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

type View = "list" | "create" | "detail" | "responses" | "analytics" | "edit" | "history";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("analytics");
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/");
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const switchView = (v: View) => {
    setView(v);
    setMobileMenuOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const navItems = [
    { key: "analytics" as const, label: "Dashboard", icon: BarChart3 },
    { key: "list" as const, label: "Propostas", icon: List },
    { key: "create" as const, label: "Nova", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="Home Music" className="h-6 sm:h-7 w-auto" />
            <span className="text-sm sm:text-lg font-bold hidden sm:inline">Admin</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Button key={item.key} variant={view === item.key ? "default" : "ghost"} size="sm" onClick={() => switchView(item.key)} className="gap-2">
                <item.icon className="w-4 h-4" />{item.label}
              </Button>
            ))}
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair"><LogOut className="w-4 h-4" /></Button>
          </div>
          <div className="flex md:hidden items-center gap-1">
            {navItems.map(item => (
              <Button key={item.key} variant={view === item.key ? "default" : "ghost"} size="icon" className="h-9 w-9" onClick={() => switchView(item.key)}>
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {view === "analytics" && <AdminAnalytics onViewProposal={(id) => { setSelectedProposalId(id); setView("detail"); }} />}
        {view === "list" && (
          <ProposalList
            onView={(id) => { setSelectedProposalId(id); setView("responses"); }}
            onEdit={(id) => { setSelectedProposalId(id); setView("edit"); }}
            onDetail={(id) => { setSelectedProposalId(id); setView("detail"); }}
          />
        )}
        {view === "create" && <ProposalForm onCreated={() => switchView("list")} onCancel={() => switchView("list")} />}
        {view === "responses" && selectedProposalId && <ProposalResponses proposalId={selectedProposalId} onBack={() => switchView("list")} />}
        {view === "detail" && selectedProposalId && <ProposalDetail proposalId={selectedProposalId} onBack={() => switchView("list")} onHistory={(id) => { setSelectedProposalId(id); setView("history"); }} />}
        {view === "history" && selectedProposalId && <ProposalHistory proposalId={selectedProposalId} onBack={() => { setView("detail"); }} />}
        {view === "edit" && selectedProposalId && (
          <ProposalEditForm
            proposalId={selectedProposalId}
            onSaved={() => switchView("list")}
            onBack={() => switchView("list")}
            onDelete={() => switchView("list")}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
