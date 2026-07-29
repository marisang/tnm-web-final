import { NextResponse } from 'next/server';
import { exigirAdminAutenticado } from '@/lib/adminAuth';
import { createAppServiceClient } from '@/lib/supabaseAppServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }

  const { id } = await params;
  const supabaseApp = createAppServiceClient();

  const { data, error } = await supabaseApp
    .from('transacoes_financeiras')
    .select('*')
    .eq('artista_id', id)
    .order('data_competencia', { ascending: false });

  if (error) {
    console.error('Erro ao carregar histórico financeiro:', error.message);
    return NextResponse.json({ success: false, error: 'Não foi possível carregar o histórico.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, historico: data ?? [] });
}
