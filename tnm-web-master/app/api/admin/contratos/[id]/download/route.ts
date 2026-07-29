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

  const { data: contrato, error: erroContrato } = await supabaseApp
    .from('contratos')
    .select('arquivo_url')
    .eq('id', id)
    .maybeSingle();

  if (erroContrato || !contrato?.arquivo_url) {
    return NextResponse.json({ success: false, error: 'Este contrato não tem um arquivo enviado.' }, { status: 404 });
  }

  const { data: assinado, error: erroAssinatura } = await supabaseApp.storage
    .from('contratos')
    .createSignedUrl(contrato.arquivo_url, 60); // link válido por 60 segundos

  if (erroAssinatura || !assinado?.signedUrl) {
    console.error('Erro ao gerar link do contrato:', erroAssinatura?.message);
    return NextResponse.json({ success: false, error: 'Não foi possível gerar o link do contrato.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: assinado.signedUrl });
}
