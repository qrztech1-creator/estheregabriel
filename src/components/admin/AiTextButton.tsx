import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Props {
  kind: string;
  context: string;
  current?: string;
  onResult: (text: string) => void;
  label?: string;
}

const AiTextButton = ({ kind, context, current, onResult, label = "Gerar com IA" }: Props) => {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("suggest-text", {
      body: { kind, context, current },
    });
    setLoading(false);
    if (error || !data?.text) {
      toast.error(data?.error || "Não foi possível gerar o texto");
      return;
    }
    onResult(data.text);
    toast.success("Texto gerado!");
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={run} disabled={loading} className="gap-1.5 h-7 px-2 text-[11px] text-primary">
      <Sparkles className="w-3 h-3" /> {loading ? "Gerando..." : label}
    </Button>
  );
};

export default AiTextButton;
