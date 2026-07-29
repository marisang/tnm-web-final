'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'enviado';

export default function AdminRecuperarSenha() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/nova-senha`,
      });

      // O Supabase nunca informa se o e-mail existe ou não (evita
      // enumeração de contas), então sempre mostramos a mesma mensagem.
      setStep('enviado');
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gray-100 px-6 py-12 font-sans md:justify-center md:gap-12">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center mt-12 md:mt-0">
        <div className="mb-8 h-24 w-24 relative">
          <Image src="/tonamidia.png" alt="Logo Tô na Mídia" fill className="object-contain" priority />
        </div>

        {step === 'email' ? (
          <>
            <h1 className="mb-2 text-2xl font-bold text-black text-center">Recuperar Senha</h1>
            <p className="mb-8 text-sm text-gray-500 text-center">
              Digite seu e-mail corporativo e enviaremos um link para você criar uma nova senha.
            </p>

            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="E-mail corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[#D9D9D9] px-4 py-4 text-base text-gray-800 placeholder-gray-500 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
                required
              />

              {erro && <p className="text-red-500 text-xs">{erro}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#7A0BC0] py-4 text-base font-semibold text-white transition hover:bg-[#620999] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📧</div>
            <h1 className="mb-2 text-2xl font-bold text-black text-center">E-mail Enviado!</h1>
            <p className="mb-8 text-sm text-gray-500 text-center">
              Se <strong>{email}</strong> estiver cadastrado, enviamos um link de recuperação.
              Verifique sua caixa de entrada e também a pasta de spam.
            </p>
            <Link
              href="/admin/login"
              className="w-full rounded-xl bg-[#7A0BC0] py-4 text-base font-semibold text-white text-center transition hover:bg-[#620999]"
            >
              Voltar ao Login
            </Link>
          </>
        )}
      </div>

      <div className="text-sm text-black mb-4">
        Lembrou a senha?{' '}
        <Link href="/admin/login" className="font-semibold text-[#7A0BC0] underline decoration-1 underline-offset-2 hover:text-[#620999]">
          Faça login
        </Link>
      </div>
    </div>
  );
}
