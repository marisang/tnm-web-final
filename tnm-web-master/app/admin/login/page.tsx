'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const acessoNegado = searchParams.get('erro') === 'acesso_negado';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  // Se a pessoa chegar aqui já autenticada (ex: acabou de clicar no link
  // de confirmação de e-mail, que loga o navegador automaticamente),
  // manda direto pro dashboard em vez de mostrar o formulário de novo.
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace('/admin/dashboard');
      } else {
        setVerificandoSessao(false);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const supabase = createClient();

      // 1º fator: e-mail + senha.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (signInError) {
        setErro('E-mail ou senha inválidos.');
        return;
      }

      // A senha autentica, mas a sessão só é confirmada após o 2º fator.
      // Por isso encerramos essa sessão imediatamente e exigimos o código
      // enviado por e-mail antes de liberar o acesso ao painel.
      await supabase.auth.signOut();

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
        },
      });

      if (otpError) {
        setErro('Não foi possível enviar o código de verificação. Tente novamente em instantes.');
        return;
      }

      sessionStorage.setItem('tnm_admin_2fa_email', email);
      router.push('/admin/2fa');
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-12 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center">
        <div className="mb-6 h-24 w-24 relative">
          <Image
            src="/tonamidia.png"
            alt="Logo Tô na Mídia"
            fill
            className="object-contain"
            priority
          />
        </div>

        {verificandoSessao ? (
          <p className="text-sm text-gray-500 py-8">Verificando sessão...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-black mb-1">Acesso Administrativo</h1>
            <p className="text-sm text-gray-500 mb-8 text-center">Restrito à equipe TNM</p>

            {acessoNegado && (
              <p className="mb-4 w-full rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
                Este e-mail não possui acesso administrativo.
              </p>
            )}

            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="E-mail corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl bg-[#D9D9D9] px-4 py-4 text-base text-gray-800 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
                required
              />

              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-[#D9D9D9] px-4 py-4 text-base text-gray-800 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
                  required
                />
                <Link
                  href="/admin/recuperar-senha"
                  className="self-start text-xs text-black hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {erro && <p className="text-red-500 text-xs">{erro}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#7A0BC0] py-4 text-base font-semibold text-white transition hover:bg-[#620999] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
