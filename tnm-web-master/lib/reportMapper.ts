import { ParsedReportRow } from './reportParser';

export type OrigemRelatorio = 'onerpm' | 'ecad' | 'abramus';

export interface ReceitaParaImportar {
  origem: OrigemRelatorio;
  competencia: string | null;
  valor_bruto: number;
  quantidade_streams: number | null;
  codigo_obra: string | null;
  status_conciliacao: 'pendente';
}

export interface MapeamentoResultado {
  receitas: ReceitaParaImportar[];
  linhasIgnoradas: number;
  avisos: string[];
}

function normalizarCabecalho(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // remove espaços/pontuação
}

/**
 * Os relatórios reais da ONErpm/ECAD/ABRAMUS variam de layout. Como ainda
 * não temos amostras desses arquivos, o mapeamento abaixo tenta reconhecer
 * as variações de nome de coluna mais comuns. Caso o relatório real use
 * nomes diferentes dos previstos aqui, ajuste as listas de candidatos
 * abaixo (ou peça para adicionarmos o layout específico).
 */
const CANDIDATOS_VALOR = ['valorbruto', 'valor', 'valortotal', 'amount', 'total', 'receita', 'valorapurado'];
const CANDIDATOS_STREAMS = ['quantidadestreams', 'streams', 'plays', 'reproducoes', 'qtdstreams', 'quantity'];
const CANDIDATOS_CODIGO = ['codigoobra', 'isrc', 'iswc', 'codigo', 'trackid', 'assetid', 'obra'];
const CANDIDATOS_COMPETENCIA = ['competencia', 'periodo', 'mesreferencia', 'mes', 'reportingmonth', 'period'];

function encontrarColuna(headers: string[], candidatos: string[]): string | null {
  const normalizados = headers.map((h) => ({ original: h, norm: normalizarCabecalho(h) }));
  for (const candidato of candidatos) {
    const encontrado = normalizados.find((h) => h.norm === candidato || h.norm.includes(candidato));
    if (encontrado) return encontrado.original;
  }
  return null;
}

function paraNumero(valor: unknown): number {
  if (typeof valor === 'number') return valor;
  if (typeof valor !== 'string') return 0;
  const limpo = valor.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  const numero = parseFloat(limpo);
  return isNaN(numero) ? 0 : numero;
}

export function mapearLinhasParaReceitas(
  rows: ParsedReportRow[],
  origem: OrigemRelatorio
): MapeamentoResultado {
  const avisos: string[] = [];

  if (rows.length === 0) {
    return { receitas: [], linhasIgnoradas: 0, avisos: ['O arquivo não contém linhas de dados.'] };
  }

  const headers = Object.keys(rows[0]);
  const colunaValor = encontrarColuna(headers, CANDIDATOS_VALOR);
  const colunaStreams = encontrarColuna(headers, CANDIDATOS_STREAMS);
  const colunaCodigo = encontrarColuna(headers, CANDIDATOS_CODIGO);
  const colunaCompetencia = encontrarColuna(headers, CANDIDATOS_COMPETENCIA);

  if (!colunaValor) {
    avisos.push(
      `Não foi possível identificar a coluna de valor bruto no arquivo. Colunas encontradas: ${headers.join(', ')}.`
    );
    return { receitas: [], linhasIgnoradas: rows.length, avisos };
  }

  if (!colunaStreams) avisos.push('Coluna de quantidade de streams/reproduções não identificada — ficará em branco.');
  if (!colunaCodigo) avisos.push('Coluna de código da obra (ISRC/ISWC) não identificada — ficará em branco.');
  if (!colunaCompetencia) avisos.push('Coluna de competência (mês/período) não identificada — ficará em branco.');

  const receitas: ReceitaParaImportar[] = [];
  let linhasIgnoradas = 0;

  for (const row of rows) {
    const valorBruto = paraNumero(row[colunaValor]);
    if (!valorBruto || valorBruto <= 0) {
      linhasIgnoradas++;
      continue;
    }

    receitas.push({
      origem,
      competencia: colunaCompetencia ? String(row[colunaCompetencia] ?? '').trim() || null : null,
      valor_bruto: valorBruto,
      quantidade_streams: colunaStreams ? paraNumero(row[colunaStreams]) : null,
      codigo_obra: colunaCodigo ? String(row[colunaCodigo] ?? '').trim() || null : null,
      status_conciliacao: 'pendente',
    });
  }

  return { receitas, linhasIgnoradas, avisos };
}
