import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Rotas administrativas acessíveis sem sessão (fluxo de login/2FA/recuperação). */
const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/2fa',
  '/admin/recuperar-senha',
  '/admin/nova-senha',
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (!isAdminRoute || isPublicAdminPath) {
    return response;
  }

  if (!url || !anonKey) {
    // Sem credenciais configuradas, não é possível validar sessão — bloqueia por segurança.
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Defesa em profundidade: além de autenticado, o e-mail precisa existir
  // na tabela usuarios (cadastro administrativo interno da TNM).
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id, cargo')
    .eq('email', user.email)
    .maybeSingle();

  if (!usuario) {
    await supabase.auth.signOut();
    const redirectUrl = new URL('/admin/login', request.url);
    redirectUrl.searchParams.set('erro', 'acesso_negado');
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
