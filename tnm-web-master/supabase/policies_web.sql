-- =====================================================================
-- Políticas de Row Level Security — Banco WEB (administrativo)
--
-- O tnm-web não usa a service_role key (não configurada no projeto WEB);
-- as leituras/escritas do painel administrativo acontecem com a sessão
-- do administrador autenticado (Supabase Auth) + a chave anônima. Por
-- isso, é necessário habilitar RLS e liberar acesso para quem estiver
-- autenticado E cadastrado na tabela `usuarios`.
--
-- Como aplicar: cole este script no Supabase Studio do projeto WEB
-- (SQL Editor → New query → Run).
-- =====================================================================

-- Função auxiliar: o e-mail autenticado pertence a um usuário administrativo?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.usuarios where email = auth.email()
  );
$$ language sql stable security definer;

-- ---------------------------------------------------------------------
-- usuarios: cada admin só enxerga o próprio registro (necessário para o
-- login/2FA confirmarem que o e-mail tem acesso administrativo).
-- ---------------------------------------------------------------------
alter table public.usuarios enable row level security;

drop policy if exists "usuarios_le_proprio_registro" on public.usuarios;
create policy "usuarios_le_proprio_registro"
  on public.usuarios for select
  using (email = auth.email());

-- ---------------------------------------------------------------------
-- Tabelas operacionais: leitura e escrita liberadas para qualquer
-- administrador autenticado (is_admin()).
-- ---------------------------------------------------------------------
alter table public.importacoes enable row level security;
alter table public.receitas enable row level security;
alter table public.obras enable row level security;
alter table public.fonogramas enable row level security;
alter table public.repasses_obras enable row level security;
alter table public.repasses_fonogramas enable row level security;
alter table public.receitas_repasses enable row level security;

drop policy if exists "importacoes_admin_full" on public.importacoes;
create policy "importacoes_admin_full" on public.importacoes
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "receitas_admin_full" on public.receitas;
create policy "receitas_admin_full" on public.receitas
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "obras_admin_full" on public.obras;
create policy "obras_admin_full" on public.obras
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "fonogramas_admin_full" on public.fonogramas;
create policy "fonogramas_admin_full" on public.fonogramas
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "repasses_obras_admin_full" on public.repasses_obras;
create policy "repasses_obras_admin_full" on public.repasses_obras
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "repasses_fonogramas_admin_full" on public.repasses_fonogramas;
create policy "repasses_fonogramas_admin_full" on public.repasses_fonogramas
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "receitas_repasses_admin_full" on public.receitas_repasses;
create policy "receitas_repasses_admin_full" on public.receitas_repasses
  for all using (public.is_admin()) with check (public.is_admin());
