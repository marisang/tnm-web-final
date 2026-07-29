import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseSpreadsheet } from '@/lib/reportParser';
import { mapearLinhasParaReceitas, OrigemRelatorio } from '@/lib/reportMapper';
import { processPDF } from '@/lib/pdfProcessor';
import { exigirAdminAutenticado } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORIGENS_VALIDAS: OrigemRelatorio[] = ['onerpm', 'ecad', 'abramus'];
const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const auth = await exigirAdminAutenticado();
  if (!auth.autorizado) {
    return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
  }
  const { usuario } = auth;
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const origemBruta = String(formData.get('origem') || '').toLowerCase();

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo foi enviado.' }, { status: 400 });
    }

    if (!ORIGENS_VALIDAS.includes(origemBruta as OrigemRelatorio)) {
      return NextResponse.json(
        { success: false, error: 'Origem inválida. Use onerpm, ecad ou abramus.' },
        { status: 400 }
      );
    }
    const origem = origemBruta as OrigemRelatorio;

    if (file.size > TAMANHO_MAXIMO) {
      return NextResponse.json(
        { success: false, error: 'O arquivo excede o tamanho máximo de 10MB.' },
        { status: 400 }
      );
    }

    const nomeArquivo = file.name.toLowerCase();
    const isPdf = nomeArquivo.endsWith('.pdf');
    const isPlanilha = nomeArquivo.endsWith('.csv') || nomeArquivo.endsWith('.xlsx');

    if (!isPdf && !isPlanilha) {
      return NextResponse.json(
        { success: false, error: 'Formato inválido. Envie um arquivo .csv, .xlsx ou .pdf.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) Extrai as linhas do arquivo
    let linhasBrutas: Record<string, string | number | undefined>[] = [];

    if (isPlanilha) {
      linhasBrutas = parseSpreadsheet(buffer);
    } else {
      const dadosPdf = await processPDF(buffer, file.name);
      const primeiraTabela = dadosPdf.tables[0];
      if (!primeiraTabela) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Não foi possível identificar uma tabela neste PDF automaticamente. Tente exportar o relatório como .csv ou .xlsx.',
          },
          { status: 422 }
        );
      }
      linhasBrutas = primeiraTabela.rows;
    }

    // 2) Mapeia para o formato da tabela receitas
    const { receitas, linhasIgnoradas, avisos } = mapearLinhasParaReceitas(linhasBrutas, origem);

    if (receitas.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma linha válida foi encontrada no arquivo.', avisos },
        { status: 422 }
      );
    }

    // 3) Registra a importação
    const colunaOrigem =
      origem === 'onerpm' ? 'onerpm' : origem === 'ecad' ? 'ecad' : 'abramus_digital';

    const { data: importacao, error: importacaoError } = await supabase
      .from('importacoes')
      .insert([
        {
          data_importacao: new Date().toISOString(),
          status: 'processando',
          usuario_id: usuario.id,
          [colunaOrigem]: file.name,
        },
      ])
      .select()
      .single();

    if (importacaoError || !importacao) {
      console.error('Erro ao registrar importação:', importacaoError?.message);
      return NextResponse.json(
        { success: false, error: 'Não foi possível registrar a importação.' },
        { status: 500 }
      );
    }

    // 4) Evita duplicidade: verifica quais (origem, competência, código da obra)
    // já existem antes de inserir.
    const codigosVerificados = Array.from(
      new Set(receitas.map((r) => r.codigo_obra).filter((c): c is string => Boolean(c)))
    );

    let receitasExistentes: { codigo_obra: string | null; competencia: string | null }[] = [];
    if (codigosVerificados.length > 0) {
      const { data } = await supabase
        .from('receitas')
        .select('codigo_obra, competencia')
        .eq('origem', origem)
        .in('codigo_obra', codigosVerificados);
      receitasExistentes = data ?? [];
    }

    const chaveExistente = new Set(
      receitasExistentes.map((r) => `${r.codigo_obra ?? ''}|${r.competencia ?? ''}`)
    );

    const novasReceitas = receitas.filter(
      (r) => !chaveExistente.has(`${r.codigo_obra ?? ''}|${r.competencia ?? ''}`)
    );
    const duplicadasIgnoradas = receitas.length - novasReceitas.length;

    // 5) Insere as novas receitas vinculadas a esta importação
    let inseridas = 0;
    if (novasReceitas.length > 0) {
      const { data: inseridasData, error: receitasError } = await supabase
        .from('receitas')
        .insert(novasReceitas.map((r) => ({ ...r, importacao_id: importacao.id })))
        .select('id');

      if (receitasError) {
        await supabase.from('importacoes').update({ status: 'erro' }).eq('id', importacao.id);
        console.error('Erro ao inserir receitas:', receitasError.message);
        return NextResponse.json(
          { success: false, error: 'Falha ao salvar as receitas importadas.' },
          { status: 500 }
        );
      }
      inseridas = inseridasData?.length ?? 0;
    }

    await supabase.from('importacoes').update({ status: 'concluida' }).eq('id', importacao.id);

    return NextResponse.json({
      success: true,
      importacaoId: importacao.id,
      resumo: {
        linhasNoArquivo: linhasBrutas.length,
        linhasIgnoradasSemValor: linhasIgnoradas,
        duplicadasIgnoradas,
        importadasComSucesso: inseridas,
      },
      avisos,
    });
  } catch (error) {
    console.error('Erro ao processar importação:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao processar o arquivo.' },
      { status: 500 }
    );
  }
}
