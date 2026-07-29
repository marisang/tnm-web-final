import * as XLSX from 'xlsx';

export interface ParsedReportRow {
  [coluna: string]: string | number | undefined;
}

/**
 * Acha a linha do cabeçalho de verdade. Nem todo relatório começa com o
 * cabeçalho na linha 1 — alguns (ex: planilhas de controle interno)
 * trazem uma linha em branco (ou um título solto) antes das colunas
 * reais. Considera cabeçalho a primeira linha, dentre as 10 primeiras,
 * com pelo menos 2 células de texto preenchidas.
 */
function encontrarLinhaCabecalho(linhasBrutas: unknown[][]): number {
  const limite = Math.min(linhasBrutas.length, 10);
  for (let i = 0; i < limite; i++) {
    const linha = linhasBrutas[i] ?? [];
    const celulasDeTexto = linha.filter(
      (v) => typeof v === 'string' && v.trim().length > 0
    );
    if (celulasDeTexto.length >= 2) return i;
  }
  return 0; // não achou nada óbvio — mantém o comportamento antigo (linha 1)
}

/**
 * Lê um arquivo .csv ou .xlsx e retorna as linhas como objetos, usando a
 * linha do cabeçalho real como referência (ver encontrarLinhaCabecalho).
 * Funciona para os dois formatos porque a biblioteca `xlsx` interpreta
 * CSV como uma planilha de uma única aba.
 */
export function parseSpreadsheet(buffer: Buffer): ParsedReportRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const primeiraAba = workbook.SheetNames[0];
  if (!primeiraAba) return [];

  const sheet = workbook.Sheets[primeiraAba];

  const linhasBrutas = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
  const linhaCabecalho = encontrarLinhaCabecalho(linhasBrutas);

  const rows = XLSX.utils.sheet_to_json<ParsedReportRow>(sheet, {
    defval: '',
    range: linhaCabecalho,
  });
  return rows;
}
