'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const RESEND_COOLDOWN_SECONDS = 30;

export default function AdminTwoFactorAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('tnm_admin_2fa_email');
    if (!storedEmail) {
      router.replace('/admin/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function handleChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = Array(6).fill('');
    pasted.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setErro('');
    setLoading(true);

    try {
      const supabase = createClient();
      const token = code.join('');

      if (token.length !== 6) {
        setErro('Informe os 6 dígitos do código.');
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error || !data.session) {
        setErro('Código inválido ou expirado. Tente novamente ou solicite um novo código.');
        return;
      }

      // Confirma que o e-mail autenticado pertence a um usuário
      // administrativo cadastrado (defesa em profundidade — o middleware
      // também valida isso a cada requisição).
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id, cargo')
        .eq('email', email)
        .maybeSingle();

      if (usuarioError || !usuario) {
        await supabase.auth.signOut();
        setErro('Este e-mail não possui acesso administrativo.');
        return;
      }

      sessionStorage.removeItem('tnm_admin_2fa_email');
      router.push('/admin/dashboard');
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0) return;
    setErro('');
    setReenviando(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) {
        setErro('Não foi possível reenviar o código. Tente novamente em instantes.');
        return;
      }
      setCode(Array(6).fill(''));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      inputs.current[0]?.focus();
    } finally {
      setReenviando(false);
    }
  }, [email, cooldown]);

  if (!email) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6 py-12 font-sans md:justify-center md:gap-12">
      <div className="flex w-full max-w-sm flex-col items-center mt-12 md:mt-0">
        <div className="mb-8 h-28 w-28 relative">
          <Image src="/tonamidia.png" alt="Logo Tô na Mídia" fill className="object-contain" priority />
        </div>

        <h1 className="text-3xl font-bold text-black text-center">Preencha o Código</h1>
        <p className="mt-2 mb-8 text-sm text-gray-500 text-center">
          Enviamos um código de verificação para <strong>{email}</strong>
        </p>

        <form className="w-full flex flex-col items-center gap-6" onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 rounded-xl bg-[#D9D9D9] text-center text-xl font-semibold text-gray-800 outline-none transition focus:ring-2 focus:ring-[#7A0BC0]"
              />
            ))}
          </div>

          {erro && <p className="text-red-500 text-xs text-center">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7A0BC0] py-4 text-base font-semibold text-white transition hover:bg-[#620999] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={reenviando || cooldown > 0}
            className="text-sm text-[#7A0BC0] font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {cooldown > 0 ? `Reenviar código (${cooldown}s)` : reenviando ? 'Reenviando...' : 'Reenviar código'}
          </button>
        </form>
      </div>
    </div>
  );
}
