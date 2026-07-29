import { NextRequest, NextResponse } from 'next/server';
import { exigirAdminAutenticado } from '@/lib/adminAuth';
import { createAppServiceClient } from '@/lib/supabaseAppServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (status !== 'aprovado' && status !== 'recusado') {
    return NextResponse.json(
      { success: false, error: "Status inválido. Use 'aprovado' ou 'recusado'." },
      { status: 400 }
    );
  }

  const supabaseApp = createAppServiceClient();
  const { error } = await supabaseApp.from('shows').update({ status_publicacao: status }).eq('id', id);

  if (error) {
    console.error('Erro ao atualizar status do show:', error.message);
    return NextResponse.json({ success: false, error: 'Não foi possível atualizar o show.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
