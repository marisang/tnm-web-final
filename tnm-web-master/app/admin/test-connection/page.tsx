'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { supabaseApp } from '@/lib/supabaseApp';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

export default function TestConnectionPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: TestResult[] = [];

    const webEnvOk = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    testResults.push({
      test: 'Variáveis de ambiente — Banco WEB',
      status: webEnvOk ? 'success' : 'error',
      message: webEnvOk
        ? 'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY configuradas'
        : 'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local',
    });

    const appEnvOk = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_APP_URL && process.env.NEXT_PUBLIC_SUPABASE_APP_ANON_KEY
    );
    testResults.push({
      test: 'Variáveis de ambiente — Banco APP',
      status: appEnvOk ? 'success' : 'error',
      message: appEnvOk
        ? 'NEXT_PUBLIC_SUPABASE_APP_URL e NEXT_PUBLIC_SUPABASE_APP_ANON_KEY configuradas'
        : 'Configure NEXT_PUBLIC_SUPABASE_APP_URL e NEXT_PUBLIC_SUPABASE_APP_ANON_KEY em .env.local',
    });

    if (webEnvOk) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('usuarios').select('id').limit(1);
        testResults.push({
          test: 'Conexão — Banco WEB (tabela usuarios)',
          status: error ? 'error' : 'success',
          message: error ? `Erro: ${error.message}` : 'Conectado com sucesso ao banco WEB',
        });
      } catch (err) {
        testResults.push({
          test: 'Conexão — Banco WEB (tabela usuarios)',
          status: 'error',
          message: err instanceof Error ? err.message : 'Erro desconhecido',
        });
      }
    }

    if (appEnvOk) {
      try {
        const { error } = await supabaseApp.from('artistas').select('id').limit(1);
        testResults.push({
          test: 'Conexão — Banco APP (tabela artistas)',
          status: error ? 'error' : 'success',
          message: error ? `Erro: ${error.message}` : 'Conectado com sucesso ao banco APP',
        });
      } catch (err) {
        testResults.push({
          test: 'Conexão — Banco APP (tabela artistas)',
          status: 'error',
          message: err instanceof Error ? err.message : 'Erro desconhecido',
        });
      }
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="pt-8 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Diagnóstico de Conexão</h1>
          <p className="text-sm text-gray-500 mb-6">
            Verifica se as credenciais dos dois projetos Supabase (WEB e APP) estão corretas.
          </p>

          <button
            onClick={runTests}
            disabled={loading}
            className="mb-6 rounded-xl bg-[#7A0BC0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#620999] disabled:opacity-60"
          >
            {loading ? 'Testando...' : 'Rodar Testes'}
          </button>

          <div className="flex flex-col gap-3">
            {results.map((r) => (
              <div
                key={r.test}
                className={`rounded-xl border p-4 ${
                  r.status === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <p className="font-semibold text-gray-800">
                  {r.status === 'success' ? '✅' : '❌'} {r.test}
                </p>
                <p className="text-sm text-gray-600">{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
