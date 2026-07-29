import { NextResponse } from 'next/server';
import { exigirAdminAutenticado } from '@/lib/adminAuth';
import { createAppServiceClient } from '@/lib/supabaseAppServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }

  const supabaseApp = createAppServiceClient();

  const [
    { data: artistas, error: erroArtistas },
    { data: transacoes, error: erroTransacoes },
    { data: contratos, error: erroContratos },
  ] = await Promise.all([
    supabaseApp.from('artistas').select('*').order('pseudonimo_artistico', { ascending: true }),
    supabaseApp.from('transacoes_financeiras').select('artista_id, valor_repasse'),
    supabaseApp.from('contratos').select('id, tipo_contrato, status, artista_id, arquivo_url, arquivo_nome'),
  ]);

  if (erroArtistas || erroTransacoes || erroContratos) {
    console.error('Erro ao carregar artistas:', erroArtistas?.message, erroTransacoes?.message, erroContratos?.message);
    return NextResponse.json({ success: false, error: 'Não foi possível carregar os artistas.' }, { status: 500 });
  }

  const totalPorArtista = new Map<string, number>();
  for (const t of transacoes ?? []) {
    totalPorArtista.set(t.artista_id, (totalPorArtista.get(t.artista_id) ?? 0) + Number(t.valor_repasse || 0));
  }

  const contratosPorArtista = new Map<string, typeof contratos>();
  for (const c of contratos ?? []) {
    const lista = contratosPorArtista.get(c.artista_id) ?? [];
    lista.push(c);
    contratosPorArtista.set(c.artista_id, lista);
  }

  const resultado = (artistas ?? []).map((a) => ({
    ...a,
    totalRecebido: totalPorArtista.get(a.id) ?? 0,
    contratos: contratosPorArtista.get(a.id) ?? [],
  }));

  return NextResponse.json({ success: true, artistas: resultado });
}
