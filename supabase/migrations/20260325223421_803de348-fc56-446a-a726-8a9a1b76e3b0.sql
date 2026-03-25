-- Seed the Esther & Gabriel proposal
INSERT INTO public.proposals (
  slug, status, bride_name, groom_name, event_date, event_start_time, event_end_time,
  venue_name, guest_count, duration_label, proposal_deadline, whatsapp_number,
  partnership_name, partnership_instagram, partnership_photo_url,
  pricing_plans, included_services, tech_details, event_timeline,
  process_steps, showcase_songs, optional_extras, extras_bundle_title, extras_bundle_price,
  audio_url
) VALUES (
  'esther-gabriel-2027', 'active', 'Esther', 'Gabriel', '2027-03-13',
  '18:00', '22:00', 'Ninho da Roxinha', 150, '4 Horas de Música Imersiva',
  '2026-04-01T13:00:00Z', '5527999936682',
  'Carol Suhet', 'https://www.instagram.com/carolsuhetcerimonialista/', NULL,
  '[{"id":"banda-2h","label":"Banda 2h","description":"Show ao vivo 2h + música ambiente no restante","total":8532,"entry30":8190.72,"savings30":341.28,"entry50":7678.80,"savings50":853.20,"aVista":7465.50,"savingsAVista":1066.50,"recommended":false},{"id":"banda-2h-dj-2h","label":"Banda 2h + DJ 2h","description":"Show ao vivo 2h + DJ com playlist personalizada 2h","total":9480,"entry30":8974.50,"savings30":505.50,"entry50":8498.53,"savings50":981.47,"aVista":8295.00,"savingsAVista":1185.00,"recommended":false},{"id":"banda-2h-dj-3h","label":"Banda 2h + DJ 3h","description":"Show ao vivo 2h + DJ com playlist personalizada 3h","total":10353,"entry30":9938.88,"savings30":414.12,"entry50":9317.70,"savings50":1035.30,"aVista":9058.88,"savingsAVista":1294.12,"recommended":false},{"id":"banda-3h-dj-2h","label":"Banda 3h + DJ 2h","description":"Show ao vivo 3h + DJ com playlist personalizada 2h","total":11984,"entry30":11504.64,"savings30":479.36,"entry50":10785.60,"savings50":1198.40,"aVista":10486.00,"savingsAVista":1498.00,"recommended":true}]'::jsonb,
  '[{"icon":"Music","text":"Show ao vivo da banda — 2 horas"},{"icon":"Disc3","text":"DJ com playlist personalizada — 2 horas"},{"icon":"Lightbulb","text":"Iluminação cênica para o palco","badge":"Cortesia"},{"icon":"Volume2","text":"Sonorização completa para 150 convidados"}]'::jsonb,
  '["Mesa de som digital","Caixas ativas de alta potência","Subwoofers","Cabeamento completo","Microfones profissionais","Logística de montagem e desmontagem","Suporte técnico durante o evento"]'::jsonb,
  '[{"time":"18:00","duration":"30 min","title":"DJ Abre a Noite","description":"A energia começa antes do primeiro brinde.","icon":"Radio","details":["Playlist personalizada pelos noivos","Ambiente lounge","Transição cinematográfica para a banda"]},{"time":"18:30","duration":"2 horas","title":"Banda ao Vivo — O Ápice","description":"16 blocos musicais do rock ao pop.","icon":"Music","details":["The Killers, Arctic Monkeys, Paramore, NX Zero","Bruno Mars, Michael Jackson","Medleys explosivos e blocos temáticos"]},{"time":"20:30","duration":"1h30","title":"DJ Fecha com Tudo","description":"O DJ assume com a playlist definitiva.","icon":"Disc3","details":["Playlist montada pelo casal","Hits que fazem todo mundo cantar junto","Energia máxima até o último segundo"]}]'::jsonb,
  '[{"icon":"CheckCircle2","title":"Fechamento do Contrato","date":"Mês 1","description":"Assinatura e entrada.","active":true},{"icon":"ListMusic","title":"Definição de Repertório","date":"Mês 2-4","description":"Vocês montam a playlist do DJ e sugerem músicas para a banda."},{"icon":"Users","title":"Reunião de Alinhamento","date":"Mês 6","description":"Encontro para alinhar detalhes finais."},{"icon":"Mic2","title":"Ensaio e Preparação","date":"Mês anterior","description":"Banda ensaia o repertório final."},{"icon":"CalendarDays","title":"Passagem de Som","date":"Dia do evento — Manhã","description":"Montagem da estrutura e passagem de som."},{"icon":"PartyPopper","title":"O Grande Dia","date":"Dia do evento","description":"Tudo pronto. A noite perfeita começa!"}]'::jsonb,
  '[{"title":"Take on Me","artist":"A-ha","videoId":"djV11Xbc914"},{"title":"Valerie","artist":"Amy Winehouse","videoId":"bixuI_GV5I0"},{"title":"Do I Wanna Know?","artist":"Arctic Monkeys","videoId":"pqrUQrAcfo4"},{"title":"Locked Out of Heaven","artist":"Bruno Mars","videoId":"e-fA-gBCkj0"},{"title":"Mr. Brightside","artist":"The Killers","videoId":"j8tZs6G_h7U"},{"title":"Still Into You","artist":"Paramore","videoId":"OblL026SvD4"}]'::jsonb,
  '[{"icon":"Monitor","title":"Painel de LED 3×2","description":"Tela de LED de alta resolução.","details":["Tamanho personalizado","Exibição de fotos e vídeos","Mensagens em tempo real","Conteúdo visual sincronizado"]},{"icon":"Lightbulb","title":"Iluminação de Pista","description":"Iluminação cênica profissional.","details":["Moving heads e spots","Efeitos de cor sincronizados","Iluminação decorativa ambiente","Operador de luz dedicado"]}]'::jsonb,
  'Pista de dança com iluminação + Tela de LED 3x2', 2800,
  '/audio/background-music.mp3'
) ON CONFLICT (slug) DO NOTHING;

-- Create client token for Esther & Gabriel
INSERT INTO public.client_tokens (token, client_name, proposal_id)
SELECT 'esther-gabriel-2027', 'Esther e Gabriel', id
FROM public.proposals WHERE slug = 'esther-gabriel-2027'
AND NOT EXISTS (SELECT 1 FROM public.client_tokens WHERE token = 'esther-gabriel-2027');

-- Add unique constraint on slug if not exists
CREATE UNIQUE INDEX IF NOT EXISTS proposals_slug_unique ON public.proposals (slug);
-- Add unique constraint on token if not exists  
CREATE UNIQUE INDEX IF NOT EXISTS client_tokens_token_unique ON public.client_tokens (token);