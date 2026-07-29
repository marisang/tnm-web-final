import { NextRequest, NextResponse } from 'next/server';
import { exigirAdminAutenticado } from '@/lib/adminAuth';
import { createAppServiceClient } from '@/lib/supabaseAppServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get('status') ?? 'pendente';
  const supabaseApp = createAppServiceClient();

  const { data, error } = await supabaseApp
    .from('shows')
    .select('*')
    .eq('status_publicacao', status)
    .order('data_evento', { ascending: true });

  if (error) {
    console.error('Erro ao listar shows:', error.message);
    return NextResponse.json({ success: false, error: 'Não foi possível carregar os shows.' }, { status: 500 });
  }

  const shows = (data ?? []).map((show) => ({
    ...show,
    banner_public_url: show.banner_url
      ? supabaseApp.storage.from('shows').getPublicUrl(show.banner_url).data.publicUrl
      : null,
  }));

  return NextResponse.json({ success: true, shows });
}

export async function POST(request: NextRequest) {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }

  const supabaseApp = createAppServiceClient();

  try {
    const formData = await request.formData();
    const artistaId = String(formData.get('artista_id') || '');
    const titulo = String(formData.get('titulo_evento') || '');
    const dataEvento = String(formData.get('data_evento') || '');
    const horaEvento = String(formData.get('hora_evento') || '') || null;
    const localNome = String(formData.get('local_nome') || '');
    const linkIngressos = String(formData.get('link_ingressos') || '') || null;
    const contatoWhatsapp = String(formData.get('contato_whatsapp') || '') || null;
    const banner = formData.get('banner') as File | null;

    if (!artistaId || !titulo || !dataEvento || !localNome) {
      return NextResponse.json(
        { success: false, error: 'Preencha artista, título, data/horário e local.' },
        { status: 400 }
      );
    }

    let bannerPath: string | null = null;
    if (banner && banner.size > 0) {
      const buffer = Buffer.from(await banner.arrayBuffer());
      const path = `banners/admin/${Date.now()}_${banner.name}`;
      const { error: uploadError } = await supabaseApp.storage
        .from('shows')
        .upload(path, buffer, { contentType: banner.type, upsert: true });

      if (uploadError) {
        console.error('Erro ao enviar banner:', uploadError.message);
        return NextResponse.json({ success: false, error: 'Não foi possível enviar a capa.' }, { status: 500 });
      }
      bannerPath = path;
    }

    const { error } = await supabaseApp.from('shows').insert([
      {
        titulo_evento: titulo,
        data_evento: dataEvento,
        hora_evento: horaEvento,
        local_nome: localNome,
        banner_url: bannerPath,
        link_ingressos: linkIngressos,
        contato_whatsapp: contatoWhatsapp,
        status_publicacao: 'pendente',
        artista_id: artistaId,
      },
    ]);

    if (error) {
      console.error('Erro ao cadastrar show:', error.message);
      return NextResponse.json({ success: false, error: 'Não foi possível cadastrar o show.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro inesperado ao cadastrar show:', error);
    return NextResponse.json({ success: false, error: 'Erro inesperado ao cadastrar o show.' }, { status: 500 });
  }
}
