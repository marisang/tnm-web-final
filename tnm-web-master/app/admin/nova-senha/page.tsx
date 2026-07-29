'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function NovaSenhaForm() {
  const router = useRouter();
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    // A essa altura, /auth/callback já deve ter trocado o código do link
    // por uma sessão de verdade. Só confirmamos que ela existe; se não
    // existir, o link provavelmente expirou ou já foi usado.
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) setErro('Este link expirou ou já foi usado. Solicite uma nova recuperação de senha.');
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (!/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha)) {
      setErro('A senha deve conter letras e números.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) {
        setErro('Não foi possível atualizar a senha. O link pode ter expirado.');
        return;
      }
      await supabase.auth.signOut();
      setSucesso(true);
      setTimeout(() => router.push('/admin/login'), 2500);
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-12 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center">
        <div className="mb-8 h-24 w-24 relative">
          <Image src="/tonamidia.png" alt="Logo Tô na Mídia" fill className="object-contain" priority />
        </div>

        {sucesso ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="mb-2 text-2xl font-bold text-black text-center">Senha Atualizada!</h1>
            <p className="text-sm text-gray-500 text-center">Redirecionando para o login...</p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold text-black text-center">Nova Senha</h1>
            <p className="mb-8 text-sm text-gray-500 text-center">Escolha uma nova senha de acesso.</p>

            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl bg-[#D9D9D9] px-4 py-4 text-base text-gray-800 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
                required
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-xl bg-[#D9D9D9] px-4 py-4 text-base text-gray-800 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
                required
              />

              {erro && <p className="text-red-500 text-xs">{erro}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#7A0BC0] py-4 text-base font-semibold text-white transition hover:bg-[#620999] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminNovaSenha() {
  return (
    <Suspense fallback={null}>
      <NovaSenhaForm />
    </Suspense>
  );
}
