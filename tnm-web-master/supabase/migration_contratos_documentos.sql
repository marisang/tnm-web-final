-- =====================================================================
-- Migração: documento (PDF) e assinatura digital em `contratos`
-- Projeto Supabase "APP" (artistas, obras, shows, contratos, transacoes_financeiras)
--
-- Como aplicar: cole este script no Supabase Studio do projeto APP
-- (SQL Editor → New query → Run).
-- =====================================================================

-- 1) Novas colunas em `contratos`
alter table public.contratos
  add column if not exists arquivo_url text,
  add column if not exists arquivo_nome text,
  add column if not exists data_upload timestamptz,
  add column if not exists assinado_em timestamptz,
  add column if not exists assinatura_nome text,
  add column if not exists assinatura_documento text;

comment on column public.contratos.arquivo_url is
  'Caminho do PDF do contrato dentro do bucket de storage "contratos" (ex: <artista_id>/<timestamp>_<nome>.pdf). Não é uma URL pública — o bucket é privado.';
comment on column public.contratos.arquivo_nome is
  'Nome original do arquivo enviado, para exibição na interface.';
comment on column public.contratos.data_upload is
  'Quando o arquivo do contrato foi enviado.';
comment on column public.contratos.assinado_em is
  'Data/hora em que o artista assinou digitalmente o contrato.';
comment on column public.contratos.assinatura_nome is
  'Nome completo informado no momento da assinatura (identificação do signatário).';
comment on column public.contratos.assinatura_documento is
  'CPF informado no momento da assinatura (identificação do signatário).';

-- 2) Bucket de storage para os PDFs — PRIVADO (documentos legais/pessoais,
-- diferente do bucket "shows", que é público para banners de divulgação).
insert into storage.buckets (id, name, public)
values ('contratos', 'contratos', false)
on conflict (id) do nothing;

-- 3) RLS: habilita a segurança em contratos. As políticas de acesso
-- (quem pode ler/gravar) ficam TODAS em fix_auth_user_id_link.sql —
-- ali elas usam a comparação certa (via artistas.auth_user_id), já
-- que artista_id é um número inteiro, não o uuid do login.
alter table public.contratos enable row level security;

-- Política de storage: artista só lê/escreve dentro da própria pasta
-- (bucket "contratos", caminho iniciando com o próprio auth.uid()).
drop policy if exists "contratos_storage_artista_le" on storage.objects;
create policy "contratos_storage_artista_le"
  on storage.objects for select
  using (bucket_id = 'contratos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "contratos_storage_artista_upload" on storage.objects;
create policy "contratos_storage_artista_upload"
  on storage.objects for insert
  with check (bucket_id = 'contratos' and (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================================
-- ATENÇÃO — leia antes de rodar em produção:
--
-- As políticas acima assumem que o painel ADMIN (tnm-web) vai deixar de
-- acessar `contratos` e o bucket "contratos" direto do navegador com a
-- anon key. Isso porque o admin autentica no projeto Supabase WEB, não
-- no projeto APP — então `auth.uid()` nunca vai bater com o admin, e as
-- políticas acima vão bloquear qualquer leitura/escrita vinda do painel
-- administrativo depois que RLS for habilitado.
--
-- Isso é intencional e necessário: contratos guardam CPF, assinatura e
-- PDFs pessoais, e hoje esses dados (junto com `artistas`, `shows`,
-- `transacoes_financeiras`) são lidos/gravados do navegador do admin
-- usando a anon key do projeto APP — ou seja, se RLS estiver desabilitado
-- nessas tabelas (como parece ser o caso hoje), qualquer pessoa com essa
-- chave (pública, embutida no app) pode ler CPF/e-mail/telefone de todos
-- os artistas ou aprovar shows sem ser admin.
--
-- Para o admin continuar funcionando COM segurança depois desta migração,
-- veja a recomendação na próxima mensagem: mover as chamadas do admin ao
-- banco APP para rotas server-side usando a service_role key do projeto
-- APP (nunca exposta ao navegador).
-- =====================================================================
