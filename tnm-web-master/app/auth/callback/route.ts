import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export const runtime = 'nodejs';

/**
 * Recebe o link que o Supabase manda por e-mail (confirmação de
 * cadastro, redefinição de senha, magic link) e completa a sessão
 * antes de redirecionar. O Supabase usa um de dois formatos dependendo
 * da configuração do projeto, então tratamos os dois:
 *   1. `?code=...`                    → exchangeCodeForSession
 *   2. `?token_hash=...&type=...`     → verifyOtp
 * Sem essa etapa, o link só "parece" logar — o navegador chega na
 * próxima página sem sessão nenhuma.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/admin/dashboard';

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Sem código válido, ou código inválido/expirado — volta pro login.
  return NextResponse.redirect(`${origin}/admin/login?erro=link_invalido`);
}
