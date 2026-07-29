'use client';

import { useEffect, useState, useCallback } from 'react';
import ShowCard from './ShowCard';

interface ShowExibicao {
  id: string;
  title: string;
  banner: string;
  bannerUrl?: string;
  date: string;
  time: string;
  location: string;
}

interface ShowApi {
  id: string;
  titulo_evento: string;
  data_evento: string;
  hora_evento: string | null;
  local_nome: string;
  banner_public_url: string | null;
}

function paraExibicao(show: ShowApi): ShowExibicao {
  return {
    id: show.id,
    title: show.titulo_evento || 'Show sem título',
    banner: 'bg-yellow-300',
    bannerUrl: show.banner_public_url ?? undefined,
    date: show.data_evento ? new Date(show.data_evento).toLocaleDateString('pt-BR') : '—',
    time: show.hora_evento ? show.hora_evento.slice(0, 5) : '—',
    location: show.local_nome || '—',
  };
}

export default function ModerationSection() {
  const [shows, setShows] = useState<ShowExibicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const carregarShowsPendentes = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resp = await fetch('/api/admin/shows?status=pendente');
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        setErro(json.error || 'Não foi possível carregar os shows pendentes de moderação.');
        setCarregando(false);
        return;
      }
      setShows((json.shows as ShowApi[]).map(paraExibicao));
    } catch {
      setErro('Não foi possível carregar os shows pendentes de moderação.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarShowsPendentes();
  }, [carregarShowsPendentes]);

  async function atualizarStatus(id: string, status: 'aprovado' | 'recusado') {
    setProcessandoId(id);
    setErro('');
    try {
      const resp = await fetch(`/api/admin/shows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        setErro(json.error || 'Não foi possível atualizar o status do show.');
        return;
      }
      setShows((atual) => atual.filter((show) => show.id !== id));
    } catch {
      setErro('Não foi possível atualizar o status do show. Tente novamente.');
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div className="bg-gray-600 rounded-lg p-6">
      <h2 className="text-white text-lg font-bold mb-4 text-center">MODERAÇÃO DA VITRINE DE SHOWS</h2>

      {erro && <p className="text-red-300 text-xs text-center mb-3">{erro}</p>}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {carregando ? (
          <div className="text-white text-center py-8">
            <p className="text-sm">Carregando shows...</p>
          </div>
        ) : shows.length > 0 ? (
          shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              loading={processandoId === show.id}
              onApprove={() => atualizarStatus(show.id, 'aprovado')}
              onReject={() => atualizarStatus(show.id, 'recusado')}
            />
          ))
        ) : (
          <div className="text-white text-center py-8">
            <p className="text-sm">Nenhum show aguardando moderação</p>
          </div>
        )}
      </div>
    </div>
  );
}
