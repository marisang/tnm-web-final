export interface ExtractedCell {
  value: string | number;
  row: number;
  col: number;
}

export interface ExtractedTable {
  headers: string[];
  rows: Array<Record<string, string | number>>;
  metadata: {
    tableIndex: number;
    startRow: number;
    endRow: number;
    columnCount: number;
    rowCount: number;
  };
}

export interface PDFStructure {
  type: 'tabular' | 'form' | 'mixed';
  confidence: number;
  detectedPatterns: string[];
}

export interface ProcessedPDFData {
  fileName: string;
  pageCount: number;
  structure: PDFStructure;
  tables: ExtractedTable[];
  rawText: string;
  processedAt: Date;
}

export interface PDFProcessingResult {
  success: boolean;
  data?: ProcessedPDFData;
  error?: string;
}
