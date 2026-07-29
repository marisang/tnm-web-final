import { createClient } from '@/lib/supabase/server';
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
 * Monta a lista de obras/fonogramas para a tela de Conciliação e Splits,
 * juntando os dados reais do banco WEB:
 * - `fonogramas` (tem ISRC) + `repasses_fonogramas` (percentual e valor apurado)
 * - `obras` (tem ISWC, sem ISRC) + `repasses_obras` (percentual e valor apurado)
 *
 * ISRCs duplicados são destacados via findDuplicateSplits (lib/duplicateDetection.ts).
 */
export async function getConciliacaoData(): Promise<ConciliacaoData> {
  const supabase = await createClient();

  const [{ data: fonogramas }, { data: repassesFonogramas }, { data: obras }, { data: repassesObras }] =
    await Promise.all([
      supabase.from('fonogramas').select('id, isrc, titulo_principal, percentual_part, obra_id'),
      supabase.from('repasses_fonogramas').select('id, percentual_part, valor_repasse, fonograma_id'),
      supabase.from('obras').select('id, iswc, titulo_principal, percentual_cat'),
      supabase.from('repasses_obras').select('id, percentual_cat, valor_repasse, obra_id'),
    ]);

  const listaFonogramas = fonogramas ?? [];
  const listaRepassesFonogramas = repassesFonogramas ?? [];
  const listaObras = obras ?? [];
  const listaRepassesObras = repassesObras ?? [];

  const repassePorFonograma = new Map(
    listaRepassesFonogramas.map((r) => [r.fonograma_id, r])
  );
  const repassePorObra = new Map(listaRepassesObras.map((r) => [r.obra_id, r]));

  const linhas: SplitRow[] = [];

  // Fonogramas (têm ISRC) — item principal da tela de conciliação.
  for (const f of listaFonogramas) {
    const repasse = repassePorFonograma.get(f.id);
    linhas.push({
      id: `fonograma-${f.id}`,
      isrc: f.isrc ?? '',
      iswc: '',
      titulo: f.titulo_principal,
      percentual: repasse?.percentual_part ?? f.percentual_part ?? undefined,
      valor: repasse?.valor_repasse,
      origem: 'fonograma',
    });
  }

  // Obras sem fonograma vinculado (apenas ISWC, sem ISRC).
  const obraIdsComFonograma = new Set(listaFonogramas.map((f) => f.obra_id).filter(Boolean));
  for (const o of listaObras) {
    if (obraIdsComFonograma.has(o.id)) continue; // já representada via fonograma acima
    const repasse = repassePorObra.get(o.id);
    linhas.push({
      id: `obra-${o.id}`,
      isrc: '',
      iswc: o.iswc ?? '',
      titulo: o.titulo_principal,
      percentual: repasse?.percentual_cat ?? o.percentual_cat ?? undefined,
      valor: repasse?.valor_repasse,
      origem: 'obra',
    });
  }

  const { duplicateRowIds, duplicateIsrcCodes } = findDuplicateSplits(linhas);

  const totalBruto = linhas.reduce((soma, l) => soma + (l.valor ?? 0), 0);
  const totalRepassado = totalBruto; // valor_repasse já é o total apurado por obra/fonograma

  return {
    linhas,
    duplicateIsrcCodes: Array.from(duplicateIsrcCodes),
    duplicateRowIds: Array.from(duplicateRowIds),
    resumo: { totalBruto, totalRepassado },
  };
}
