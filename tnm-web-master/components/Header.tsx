'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ITENS_MENU = [
  { href: '/admin', label: 'Painel Principal', icone: '📋', descricao: 'Moderação e criação de shows' },
  { href: '/admin/dashboard', label: 'Dashboard e Importação', icone: '📊', descricao: 'Indicadores e relatórios' },
  { href: '/admin/conciliacao', label: 'Conciliação e Splits', icone: '💰', descricao: 'Obras, ISRC e divisão de receitas' },
  { href: '/admin/artistas', label: 'Gestão de Artistas', icone: '🎤', descricao: 'Cadastro, contratos e financeiro' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-purple-600">
            🎵
          </div>
          <span className="text-xl font-bold">TNM Shows</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="text-2xl hover:opacity-80 transition-opacity" aria-label="Notificações">🔔</button>
          <button
            onClick={() => setMenuOpen((atual) => !atual)}
            className="text-2xl hover:opacity-80 transition-opacity leading-none"
            aria-label="Abrir menu de navegação"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menu Dropdown */}
      {menuOpen && (
        <>
          {/* Overlay para fechar o menu ao clicar fora */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />

          <nav className="absolute right-4 top-16 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50 min-w-[260px]">
            {ITENS_MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-medium">{item.icone} {item.label}</span>
                <span className="block text-xs text-gray-500">{item.descricao}</span>
              </Link>
            ))}

            <Link
              href="/admin/test-connection"
              className="block px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 text-blue-600 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              🔌 Teste de Conexão
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
            >
              🚪 Sair
            </button>
          </nav>
        </>
      )}
    </header>
  );
}