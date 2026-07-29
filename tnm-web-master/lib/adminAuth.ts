import { createClient } from '@/lib/supabase/server';

/**
 * Confirma que a requisição vem de um admin com sessão válida no
 * projeto Supabase WEB e presente na tabela `usuarios`. Usado por toda
 * rota de API que precisa de privilégio administrativo — inclusive as
 * que acessam o banco APP via service role (lib/supabaseAppServer.ts),
 * já que aquele banco não tem como saber, sozinho, quem é admin.
 */
export async function exigirAdminAutenticado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { autorizado: false as const };

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id, nome')
    .eq('email', user.email)
    .maybeSingle();

  if (!usuario) return { autorizado: false as const };

  return { autorizado: true as const, usuario };
}
