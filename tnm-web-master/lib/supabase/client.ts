import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Cliente Supabase do projeto WEB (banco administrativo — usuarios, obras,
 * fonogramas, importacoes, receitas, repasses).
 *
 * Usa @supabase/ssr para persistir a sessão em cookies (em vez de
 * localStorage), permitindo que o middleware e os Server Components
 * validem a autenticação do administrador no servidor.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. Verifique o arquivo .env.local.'
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
