'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';

interface Contrato {
  id: string;
  tipo_contrato: string;
  status: string;
  artista_id: string;
  arquivo_url: string | null;
  arquivo_nome: string | null;
}

interface TransacaoFinanceira {
  id: string;
  origem_receita: string;
  valor_arrecadado: number;
  valor_repasse: number;
  data_competencia: string;
  artista_id: string;
}

interface ArtistaComResumo {
  id: string;
  nome_completo: string;
  pseudonimo_artistico: string;
  cpf: string;
  data_nascimento?: string;
  email: string;
  celular: string;
  endereco_completo?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  totalRecebido: number;
  contratos: Contrato[];
}

function statusDoArtista(contratos: Contrato[]): { label: string; className: string } {
  if (contratos.length === 0) {
    return { label: 'Sem contrato', className: 'bg-gray-100 text-gray-600' };
  }
  const temAtivo = contratos.some((c) => c.status?.toLowerCase() === 'ativo');
  if (temAtivo) return { label: 'Ativo', className: 'bg-green-100 text-green-800' };

  const temPendente = contratos.some((c) => c.status?.toLowerCase() === 'pendente');
  if (temPendente) return { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' };

  return { label: 'Inativo', className: 'bg-red-100 text-red-800' };
}

export default function GestaoArtistasPage() {
  const [artistas, setArtistas] = useState<ArtistaComResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [artistaSelecionado, setArtistaSelecionado] = useState<ArtistaComResumo | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [historico, setHistorico] = useState<TransacaoFinanceira[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [baixandoContratoId, setBaixandoContratoId] = useState<string | null>(null);
  const [erroContrato, setErroContrato] = useState('');

  const carregarArtistas = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resp = await fetch('/api/admin/artistas');
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        setErro(json.error || 'Não foi possível carregar os artistas.');
        setCarregando(false);
        return;
      }
      setArtistas(json.artistas as ArtistaComResumo[]);
    } catch {
      setErro('Não foi possível carregar os artistas. Verifique a conexão.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarArtistas();
  }, [carregarArtistas]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  async function handleBaixarContrato(contratoId: string) {
    setErroContrato('');
    setBaixandoContratoId(contratoId);
    try {
      const resp = await fetch(`/api/admin/contratos/${contratoId}/download`);
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        setErroContrato(json.error || 'Não foi possível gerar o link do contrato.');
        return;
      }
      window.open(json.url, '_blank', 'noopener,noreferrer');
    } catch {
      setErroContrato('Não foi possível gerar o link do contrato.');
    } finally {
      setBaixandoContratoId(null);
    }
  }

  async function handleVerDetalhes(artista: ArtistaComResumo) {
    setArtistaSelecionado(artista);
    setModalAberto(true);
    setCarregandoHistorico(true);
    try {
      const resp = await fetch(`/api/admin/artistas/${artista.id}/historico`);
      const json = await resp.json();
      setHistorico(resp.ok && json.success ? json.historico : []);
    } catch {
      setHistorico([]);
    } finally {
      setCarregandoHistorico(false);
    }
  }

  const totalPago = artistas.reduce((sum, a) => sum + a.totalRecebido, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">🎤</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Gestão de Artistas</h1>
            </div>
          </div>

          {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

          {/* Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total de Artistas</p>
              <p className="text-2xl font-bold text-gray-900">{artistas.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Repassado aos Artistas</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalPago)}</p>
            </div>
          </div>

          {/* Lista de Artistas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-purple-600">
              <h2 className="text-xl font-bold text-white">Artistas Cadastrados</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome Artístico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome Real
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Recebido
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {carregando ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        Carregando artistas...
                      </td>
                    </tr>
                  ) : artistas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                        Nenhum artista cadastrado.
                      </td>
                    </tr>
                  ) : (
                    artistas.map((artista) => {
                      const status = statusDoArtista(artista.contratos);
                      return (
                        <tr key={artista.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {artista.pseudonimo_artistico}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {artista.nome_completo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {artista.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {artista.celular}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                            {formatCurrency(artista.totalRecebido)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleVerDetalhes(artista)}
                              className="text-purple-600 hover:text-purple-900 font-semibold"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhes */}
      {modalAberto && artistaSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Detalhes do Artista</h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-2xl hover:opacity-80"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome Artístico</p>
                  <p className="font-semibold">{artistaSelecionado.pseudonimo_artistico}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nome Real</p>
                  <p className="font-semibold">{artistaSelecionado.nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-semibold">{artistaSelecionado.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="font-semibold">
                    {artistaSelecionado.data_nascimento
                      ? new Date(artistaSelecionado.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{artistaSelecionado.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-semibold">{artistaSelecionado.celular}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-semibold">
                    {[artistaSelecionado.endereco_completo, artistaSelecionado.bairro, artistaSelecionado.municipio, artistaSelecionado.uf]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">Total Recebido</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(artistaSelecionado.totalRecebido)}
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-bold text-lg mb-3">Contratos</h4>
                {artistaSelecionado.contratos.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum contrato registrado para este artista.</p>
                ) : (
                  <div className="space-y-2">
                    {artistaSelecionado.contratos.map((c) => {
                      const badge = statusDoArtista([c]);
                      return (
                        <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                          <div>
                            <span className="text-sm text-gray-800">{c.tipo_contrato}</span>
                            {c.arquivo_nome && (
                              <span className="block text-xs text-gray-400">{c.arquivo_nome}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                              {c.status}
                            </span>
                            {c.arquivo_url && (
                              <button
                                onClick={() => handleBaixarContrato(c.id)}
                                disabled={baixandoContratoId === c.id}
                                className="text-purple-600 hover:text-purple-900 text-sm font-semibold disabled:opacity-50"
                              >
                                {baixandoContratoId === c.id ? 'Gerando link...' : 'Baixar PDF'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {erroContrato && <p className="text-xs text-red-500 mt-2">{erroContrato}</p>}
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-bold text-lg mb-3">Histórico Financeiro e de Repasses</h4>
                {carregandoHistorico ? (
                  <p className="text-sm text-gray-500">Carregando histórico...</p>
                ) : historico.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma transação financeira registrada para este artista.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Competência</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Arrecadado</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Repassado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {historico.map((t) => (
                          <tr key={t.id}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {t.data_competencia ? new Date(t.data_competencia).toLocaleDateString('pt-BR') : '—'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">{t.origem_receita}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right">{formatCurrency(Number(t.valor_arrecadado || 0))}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right font-semibold text-purple-600">
                              {formatCurrency(Number(t.valor_repasse || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
