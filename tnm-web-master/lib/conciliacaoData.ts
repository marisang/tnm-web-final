import { createAppServiceClient } from '@/lib/supabaseAppServer';
import { SplitRow } from '@/types/splitReconciliation';
import { findDuplicateSplits } from '@/lib/duplicateDetection';

export interface ConciliacaoResumo {
  totalBruto: number;
  totalRepassado: number;
}

export interface ConciliacaoData {
  linhas: SplitRow[];
  duplicateIsrcCodes: string[];
  duplicateRowIds: string[];
  resumo: ConciliacaoResumo;
}

/**
 * Monta a lista de artistas para a tela de Conciliação,
 * usando os dados reais do banco APP:
 * - `artistas` (nome/pseudônimo)
 * - `transacoes_financeiras` (valor_arrecadado e valor_repasse por artista)
 *
 * O "Valor Repassado" exibido é a soma direta de transacoes_financeiras.valor_repasse
 * por artista — o mesmo valor que aparece no dashboard do artista.
 * Não há aplicação de percentuais de split.
 */
export async function getConciliacaoData(): Promise<ConciliacaoData> {
  const supabaseApp = createAppServiceClient();

  const [{ data: artistas }, { data: transacoes }] = await Promise.all([
    supabaseApp.from('artistas').select('id, pseudonimo_artistico, nome_completo'),
    supabaseApp.from('transacoes_financeiras').select('artista_id, origem_receita, valor_arrecadado, valor_repasse'),
  ]);

  const listaArtistas = artistas ?? [];
  const listaTransacoes = transacoes ?? [];

  // Agrupa transações por artista
  const repassePorArtista = new Map<string, number>();
  const brutoPoArtista = new Map<string, number>();

  for (const t of listaTransacoes) {
    repassePorArtista.set(
      t.artista_id,
      (repassePorArtista.get(t.artista_id) ?? 0) + Number(t.valor_repasse || 0)
    );
    brutoPoArtista.set(
      t.artista_id,
      (brutoPoArtista.get(t.artista_id) ?? 0) + Number(t.valor_arrecadado || 0)
    );
  }

  const linhas: SplitRow[] = listaArtistas.map((a) => ({
    id: `artista-${a.id}`,
    isrc: '',
    iswc: '',
    titulo: a.pseudonimo_artistico || a.nome_completo || '—',
    percentual: undefined,
    valor: repassePorArtista.get(a.id),
    valorBruto: brutoPoArtista.get(a.id),
    origem: 'artista' as const,
  }));

  const { duplicateRowIds, duplicateIsrcCodes } = findDuplicateSplits(linhas);

  const totalBruto = linhas.reduce((soma, l) => soma + (l.valorBruto ?? 0), 0);
  const totalRepassado = linhas.reduce((soma, l) => soma + (l.valor ?? 0), 0);

  return {
    linhas,
    duplicateIsrcCodes: Array.from(duplicateIsrcCodes),
    duplicateRowIds: Array.from(duplicateRowIds),
    resumo: { totalBruto, totalRepassado },
  };
}
