import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, List } from "lucide-react";
import logo from "@/assets/logo-homemusic.png";
import { Button } from "@/components/ui/button";
import ProposalList from "@/components/admin/ProposalList";
import ProposalForm from "@/components/admin/ProposalForm";
import ProposalResponses from "@/components/admin/ProposalResponses";

type View = "list" | "create" | "detail";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Home Music" className="h-7 w-auto" />
            <span className="text-lg font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}>
              <List className="w-4 h-4 mr-2" /> Propostas
            </Button>
            <Button variant={view === "create" ? "default" : "ghost"} size="sm" onClick={() => setView("create")}>
              <Plus className="w-4 h-4 mr-2" /> Nova
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === "list" && <ProposalList onView={(id) => { setSelectedProposalId(id); setView("detail"); }} />}
        {view === "create" && <ProposalForm onCreated={() => setView("list")} onCancel={() => setView("list")} />}
        {view === "detail" && selectedProposalId && <ProposalResponses proposalId={selectedProposalId} onBack={() => setView("list")} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
