-- =====================================================================
-- Hardening de RLS — Projeto Supabase "APP"
--
-- Contexto: o painel administrativo (tnm-web) e o app do artista usam
-- bancos Supabase DIFERENTES. O admin autentica no projeto WEB; o
-- artista autentica no projeto APP. Isso significa que o admin NUNCA
-- aparece como `auth.uid()` no projeto APP — então qualquer política
-- de RLS baseada em auth.uid() vai, corretamente, bloquear o painel
-- admin quando ele tentar acessar este banco com a anon key.
--
-- Por isso, a partir desta migração, o painel admin passa a acessar
-- `artistas`, `shows`, `contratos` e `transacoes_financeiras` (projeto
-- APP) por rotas server-side (app/api/admin/...) usando a
-- SUPABASE_APP_SERVICE_ROLE_KEY, que ignora RLS com segurança porque
-- nunca é exposta ao navegador. Veja lib/supabaseAppServer.ts.
--
-- IMPORTANTE: este script só HABILITA a RLS (enable row level security)
-- e cria a única política que não depende de artista_id (leitura
-- pública de shows aprovados). Todas as políticas que comparam com
-- artista_id/id de artista ficam em fix_auth_user_id_link.sql, porque
-- ali (id, artista_id) é number inteiro, não o uuid do login — comparar
-- direto com auth.uid() dá erro "operator does not exist: uuid = integer".
--
-- Rode este script no SQL Editor do projeto Supabase APP, e depois rode
-- fix_auth_user_id_link.sql (ele cria as políticas que faltam aqui).
-- =====================================================================

alter table public.artistas enable row level security;
alter table public.shows enable row level security;
alter table public.transacoes_financeiras enable row level security;
alter table public.contratos enable row level security;

-- Única política deste arquivo que não depende de artista_id: leitura
-- pública dos shows já aprovados (vitrine pública).
drop policy if exists "shows_publico_le_aprovados" on public.shows;
create policy "shows_publico_le_aprovados"
  on public.shows for select
  using (status_publicacao = 'aprovado');

-- Note que NÃO existe (nem aqui, nem em fix_auth_user_id_link.sql)
-- política de UPDATE de shows para anon/authenticated: aprovar/recusar
-- um show só pode ser feito pela rota server-side do admin (service
-- role), nunca direto do navegador.

-- =====================================================================
-- As políticas de artistas/shows(próprio artista)/transacoes_financeiras/
-- contratos que faltam aqui estão em fix_auth_user_id_link.sql —
-- rode-o em seguida.
-- =====================================================================
