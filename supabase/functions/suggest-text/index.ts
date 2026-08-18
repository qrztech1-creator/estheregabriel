import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const kind = typeof body.kind === 'string' ? body.kind.slice(0, 60) : 'descricao';
    const context = typeof body.context === 'string' ? body.context.slice(0, 2000) : '';
    const current = typeof body.current === 'string' ? body.current.slice(0, 2000) : '';

    if (!context && !current) {
      return new Response(JSON.stringify({ error: 'Informe algum contexto para gerar o texto.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'IA indisponível.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'Você escreve textos comerciais para uma produtora de música ao vivo para casamentos e eventos (Home Music). ' +
              'Tom sofisticado, direto, elegante, em português do Brasil. Sem emojis, sem clichês genéricos, sem markdown. ' +
              'Responda APENAS com o texto final, entre 1 e 3 frases, pronto para ser exibido ao cliente.',
          },
          {
            role: 'user',
            content: `Tipo de campo: ${kind}\nContexto: ${context}\nTexto atual (melhore se existir): ${current || '(vazio)'}`,
          },
        ],
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: 'Limite de uso da IA atingido. Tente novamente em instantes.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: 'Créditos de IA esgotados.' }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!res.ok) {
      const detail = await res.text();
      console.error('AI gateway error', res.status, detail);
      return new Response(JSON.stringify({ error: 'Falha ao gerar texto.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim() ?? '';

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Erro inesperado.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
