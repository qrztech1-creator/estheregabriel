# Evolução da plataforma de propostas

## Status do rascunho enviado (já implementado)

| Item | Situação |
|---|---|
| Faixas de preço por região (GV 450–650 / Fora 700–1000) | Feito — seletor de região na criação/edição e faixas de referência na aba Pacotes |
| Contratos internos (repasses, responsáveis, termos) | Feito — aba "Interno" |
| Selecionar mais de um pacote | Feito — cliente marca pacotes no resumo |
| Checklist interno (técnico e artístico) | Feito — aba "Checklist" |
| Sugestão de descrição por IA | Parcial — existe nos pacotes; falta nos demais campos de texto |
| Preço de custo interno por item | Feito |
| Cortesia por serviço | Feito |
| Detalhamento no resumo final do cliente | Feito — pacotes, itens, cortesias e extras |
| Indicação/opcionais ligáveis por proposta | Feito |

## O que falta construir

### 1. Custo e lucro visíveis já na criação
Hoje o painel de custo/margem só aparece depois de salvar a proposta (aba Pacotes).
- Mover o bloco de pacotes/itens/custos para dentro do fluxo de criação, com resumo fixo de Custo · Venda · Lucro · Margem % atualizando em tempo real.
- Mesmo resumo fixo no topo da aba Pacotes.

### 2. Seção de opcionais padronizada
Substituir a seção LED/pista atual por uma seção genérica de Opcionais e Adicionais, com um padrão fixo por item: nome do serviço, descrição e preço (+ imagem opcional e marcação de recomendado).
- Fonte de dados: pacotes com categoria "extra" e itens avulsos já existentes — sem duplicar cadastro.
- Cliente seleciona os opcionais e eles entram no total do resumo.

### 3. Playlist com capa e links
- Novos campos por música: URL da capa, link Spotify, link YouTube (cadastro no admin e via RPC do cliente).
- Card da faixa com imagem, botões de Spotify/YouTube e player embutido do YouTube quando houver.
- Reordenação por arrastar-e-soltar das músicas dentro do bloco (hoje só os blocos são reordenáveis), gravando a ordem preferida do cliente.
- Barra de "fluxo musical": energia por bloco/ordem atual, para o cliente ver o impacto ao reordenar.

### 4. Exportação da proposta em PDF
- Geração no cliente (jsPDF + html2canvas) a partir do admin.
- Duas saídas: **PDF do cliente** (proposta, pacotes, opcionais, valores) e **PDF interno** (custos, margem, checklist e contrato interno).
- Botões de baixar e de compartilhar por WhatsApp/e-mail com o link da proposta.

### 5. Editor de aparência e ordem por proposta
- Cores: sobrescrever os tokens principais (fundo, texto, destaque) por proposta.
- Imagens: trocar imagem de fundo/hero e imagens de seção.
- Arrastar-e-soltar para reordenar seções da página pública.
- Arrastar-e-soltar para reordenar campos dentro das listas do formulário (serviços incluídos, timeline, etapas do processo, técnicos, músicas, itens de pacote) — sem redigitar nada.
- Tudo salvo em uma coluna `theme` (JSON) na proposta.

### 6. Templates adicionais
Além do template atual (padrão, mantido intacto):
- **Noir Editorial** — alto contraste preto/creme, tipografia serifada, transições por corte e revelação de máscara.
- **Aurora Neon** — escuro azul/violeta com brilho, animações fluidas de partículas e paralaxe suave.
Seletor de template na criação/edição; o template atual continua sendo o padrão.

### 7. IA em todos os campos de descrição
Estender o botão de IA para todos os campos de texto livre do admin: descrição da proposta, serviços incluídos, detalhes técnicos, timeline, etapas, opcionais, checklist e termos internos.

## Notas técnicas
- Migração: colunas `theme jsonb`, `template text`, `section_order jsonb` em `proposals`; `cover_url`, `spotify_url`, `youtube_url`, `energy` em `playlist_songs`; ordem de músicas por cliente em nova tabela de preferências.
- As RPCs públicas (`get_public_proposal`, `get_playlist_session`) passam a devolver os novos campos — sem abrir acesso direto às tabelas.
- Drag-and-drop com `@dnd-kit`.
- PDF gerado no navegador, sem edge function.

## Entrega e evidências
Ao final: prints do admin (custo/lucro na criação, abas, DnD), da proposta pública nos 3 templates, do PDF gerado (páginas conferidas uma a uma) e do fluxo de playlist com links — além dos testes de isolamento por token.

## Sequência sugerida
1. Custo/lucro na criação + IA em todos os campos + opcionais padronizados
2. Playlist (capa, links, DnD, fluxo)
3. Exportação em PDF
4. Editor de aparência/ordem + DnD de campos
5. Dois novos templates
