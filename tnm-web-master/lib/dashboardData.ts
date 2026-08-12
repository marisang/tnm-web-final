import { DashboardMetrics } from '@/types/dashboard';
import { createClient } from '@/lib/supabase/server';

/**
 * Calcula os indicadores do Dashboard a partir dos dados reais do banco WEB.
 *
 * Regras de negócio:
 * - A ONErpm retém 30% do faturamento bruto antes de repassar o restante.
 * - "Valor Retido pela TNM" = faturamento bruto - parte da ONErpm - soma de
 *   todos os repasses já apurados (o que sobra é a margem da TNM).
 * - "Repasses Pendentes" = soma dos repasses cuja receita de origem ainda
 *   não está com status_conciliacao = 'pago'.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const [{ data: receitas }, { data: repassesObras }, { data: repassesFonogramas }, { data: receitasRepasses }] =
    await Promise.all([
      supabase.from('receitas').select('id, valor_bruto, status_conciliacao'),
      supabase.from('repasses_obras').select('id, valor_repasse'),
      supabase.from('repasses_fonogramas').select('id, valor_repasse'),
      supabase.from('receitas_repasses').select('receita_id, repasse_obra_id, repasse_fonograma_id'),
    ]);

  const listaReceitas = receitas ?? [];
  const listaRepassesObras = repassesObras ?? [];
  const listaRepassesFonogramas = repassesFonogramas ?? [];
  const listaReceitasRepasses = receitasRepasses ?? [];

  const faturamentoTotalBruto = listaReceitas.reduce(
    (soma, r) => soma + Number(r.valor_bruto || 0),
    0
  );

  const valorPorRepasseObra = new Map(listaRepassesObras.map((r) => [r.id, Number(r.valor_repasse || 0)]));
  const valorPorRepasseFonograma = new Map(
    listaRepassesFonogramas.map((r) => [r.id, Number(r.valor_repasse || 0)])
  );
  const statusPorReceita = new Map(listaReceitas.map((r) => [r.id, r.status_conciliacao]));

  const totalRepassado =
    listaRepassesObras.reduce((s, r) => s + Number(r.valor_repasse || 0), 0) +
    listaRepassesFonogramas.reduce((s, r) => s + Number(r.valor_repasse || 0), 0);

  let repassesPendentes = 0;
  for (const rr of listaReceitasRepasses) {
    const status = statusPorReceita.get(rr.receita_id);
    if (status === 'pago') continue;

    if (rr.repasse_obra_id) repassesPendentes += valorPorRepasseObra.get(rr.repasse_obra_id) ?? 0;
    if (rr.repasse_fonograma_id) repassesPendentes += valorPorRepasseFonograma.get(rr.repasse_fonograma_id) ?? 0;
  }

  const parteONErpm = faturamentoTotalBruto * 0.3; // ONErpm retém 30% do bruto
  const valorRetidoTNM = Math.max(faturamentoTotalBruto - parteONErpm - totalRepassado, 0);

  return {
    faturamentoTotalBruto,
    valorRetidoTNM,
    repassesPendentes,
    atualizadoEm: new Date(),
  };
}
