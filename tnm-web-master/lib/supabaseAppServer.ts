import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do projeto APP (artistas, shows, contratos,
 * transacoes_financeiras) usando a SERVICE ROLE KEY.
 *
 * ATENÇÃO: este client ignora TODAS as políticas de RLS. Só pode ser
 * importado em código que roda no servidor (Route Handlers, Server
 * Components, Server Actions) — nunca em um componente 'use client'.
 * O pacote `server-only` garante isso: o build falha se este arquivo
 * for importado por engano em código de cliente.
 *
 * Requer a variável de ambiente SUPABASE_APP_SERVICE_ROLE_KEY (sem o
 * prefixo NEXT_PUBLIC_, para nunca ser incluída no bundle do navegador).
 */
export function createAppServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_APP_URL;
  const serviceRoleKey = process.env.SUPABASE_APP_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Configuração ausente: defina NEXT_PUBLIC_SUPABASE_APP_URL e SUPABASE_APP_SERVICE_ROLE_KEY (veja .env.local.example).'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
