import * as pdfParse from 'pdf-parse';
import type { ExtractedTable, PDFStructure, ProcessedPDFData } from '@/types/pdf-processor';

// Wrapper para lidar com diferentes formatos de exportação
const pdf = (pdfParse as any).default || pdfParse;

/**
 * Identifica automaticamente a estrutura do PDF
 */
function identifyStructure(text: string): PDFStructure {
  const patterns: string[] = [];
  let score = 0;
  
  // Detecta padrões tabulares
  const hasMultipleColumns = /\s{3,}/.test(text);
  const hasNumericPatterns = /\d+[.,]\d+/.test(text);
  const hasPipeSeparators = /\|/.test(text);
  const hasTabSeparators = /\t/.test(text);
  
  if (hasMultipleColumns) {
    patterns.push('multiple_columns');
    score += 0.3;
  }
  
  if (hasNumericPatterns) {
    patterns.push('numeric_data');
    score += 0.2;
  }
  
  if (hasPipeSeparators || hasTabSeparators) {
    patterns.push('explicit_separators');
    score += 0.4;
  }
  
  // Detecta padrões de formulário
  const hasLabels = /[A-Za-zÀ-ÿ\s]+:/.test(text);
  const hasKeyValuePairs = /[A-Za-zÀ-ÿ\s]+:\s*[^\n]+/.test(text);
  
  if (hasLabels && hasKeyValuePairs) {
    patterns.push('form_structure');
    score += 0.3;
  }
  
  // Detecta cabeçalhos de tabela
  const lines = text.split('\n').filter(line => line.trim());
  const potentialHeaders = lines.slice(0, 5).filter(line => {
    const words = line.trim().split(/\s{2,}|\t/);
    return words.length >= 2 && words.length <= 10;
  });
  
  if (potentialHeaders.length > 0) {
    patterns.push('table_headers');
    score += 0.4;
  }
  
  // Determina o tipo
  let type: 'tabular' | 'form' | 'mixed' = 'mixed';
  if (score >= 0.7 && (hasPipeSeparators || hasTabSeparators || hasMultipleColumns)) {
    type = 'tabular';
  } else if (hasKeyValuePairs && !hasMultipleColumns) {
    type = 'form';
  }
  
  return {
    type,
    confidence: Math.min(score, 1),
    detectedPatterns: patterns
  };
}

/**
 * Extrai tabelas do texto do PDF
 */
function extractTables(text: string, structure: PDFStructure): ExtractedTable[] {
  const tables: ExtractedTable[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  if (structure.type === 'form') {
    // Para formulários, extrai pares chave-valor
    return extractFormData(lines);
  }
  
  // Para dados tabulares
  let currentTable: ExtractedTable | null = null;
  let tableIndex = 0;
  let startRow = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detecta separadores de coluna (múltiplos espaços, tabs ou pipes)
    const columns = line.split(/\s{2,}|\t|\|/).map(col => col.trim()).filter(col => col);
    
    if (columns.length >= 2) {
      if (!currentTable) {
        // Inicia nova tabela - primeira linha é o cabeçalho
        currentTable = {
          headers: columns,
          rows: [],
          metadata: {
            tableIndex: tableIndex++,
            startRow: i,
            endRow: i,
            columnCount: columns.length,
            rowCount: 0
          }
        };
        startRow = i;
      } else if (columns.length === currentTable.headers.length) {
        // Adiciona linha à tabela atual
        const row: Record<string, string | number> = {};
        
        currentTable.headers.forEach((header, index) => {
          const value = columns[index] || '';
          // Tenta converter para número se possível
          const numValue = parseFloat(value.replace(',', '.'));
          row[header] = isNaN(numValue) ? value : numValue;
        });
        
        currentTable.rows.push(row);
        currentTable.metadata.endRow = i;
        currentTable.metadata.rowCount++;
      } else {
        // Mudança no número de colunas - finaliza tabela atual
        if (currentTable && currentTable.rows.length > 0) {
          tables.push(currentTable);
        }
        currentTable = null;
      }
    } else if (currentTable && line.length === 0) {
      // Linha vazia pode indicar fim da tabela
      if (currentTable.rows.length > 0) {
        tables.push(currentTable);
      }
      currentTable = null;
    }
  }
  
  // Adiciona última tabela se existir
  if (currentTable && currentTable.rows.length > 0) {
    tables.push(currentTable);
  }
  
  return tables;
}

/**
 * Extrai dados de formulários (pares chave-valor)
 */
function extractFormData(lines: string[]): ExtractedTable[] {
  const formData: Record<string, string | number> = {};
  
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      
      // Tenta converter para número
      const numValue = parseFloat(value.replace(',', '.'));
      formData[key] = isNaN(numValue) ? value : numValue;
    }
  }
  
  if (Object.keys(formData).length > 0) {
    return [{
      headers: ['Campo', 'Valor'],
      rows: Object.entries(formData).map(([key, value]) => ({
        'Campo': key,
        'Valor': value
      })),
      metadata: {
        tableIndex: 0,
        startRow: 0,
        endRow: Object.keys(formData).length,
        columnCount: 2,
        rowCount: Object.keys(formData).length
      }
    }];
  }
  
  return [];
}

/**
 * Processa um buffer de PDF e extrai os dados estruturados
 */
export async function processPDF(
  buffer: Buffer,
  fileName: string
): Promise<ProcessedPDFData> {
  try {
    // Parse do PDF
    const data = await pdf(buffer);
    
    // Identifica estrutura
    const structure = identifyStructure(data.text);
    
    // Extrai tabelas
    const tables = extractTables(data.text, structure);
    
    return {
      fileName,
      pageCount: data.numpages,
      structure,
      tables,
      rawText: data.text,
      processedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Erro ao processar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Exporta dados para formato CSV
 */
export function exportToCSV(table: ExtractedTable): string {
  const rows = [
    table.headers.join(','),
    ...table.rows.map(row => 
      table.headers.map(header => {
        const value = row[header];
        // Escapa valores com vírgula ou aspas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  
  return rows.join('\n');
}

/**
 * Exporta dados para formato JSON
 */
export function exportToJSON(data: ProcessedPDFData): string {
  return JSON.stringify(data, null, 2);
}
