import { SplitRow } from '@/types/splitReconciliation';

export interface DuplicateInfo {
  duplicateRowIds: Set<string>;
  duplicateIsrcCodes: Set<string>;
  duplicateIswcCodes: Set<string>;
}

/**
 * Identifica linhas cujo ISRC ou ISWC aparece em mais de uma linha da planilha.
 * Códigos vazios ("") são ignorados, para não marcar todas as linhas sem
 * código preenchido como "duplicadas" entre si.
 */
export function findDuplicateSplits(rows: SplitRow[]): DuplicateInfo {
  const isrcCounts = new Map<string, number>();
  const iswcCounts = new Map<string, number>();

  for (const row of rows) {
    const isrc = row.isrc.trim();
    const iswc = row.iswc.trim();

    if (isrc) isrcCounts.set(isrc, (isrcCounts.get(isrc) ?? 0) + 1);
    if (iswc) iswcCounts.set(iswc, (iswcCounts.get(iswc) ?? 0) + 1);
  }

  const duplicateIsrcCodes = new Set(
    [...isrcCounts.entries()].filter(([, count]) => count > 1).map(([code]) => code)
  );
  const duplicateIswcCodes = new Set(
    [...iswcCounts.entries()].filter(([, count]) => count > 1).map(([code]) => code)
  );

  const duplicateRowIds = new Set<string>();
  for (const row of rows) {
    const isrc = row.isrc.trim();
    const iswc = row.iswc.trim();

    if ((isrc && duplicateIsrcCodes.has(isrc)) || (iswc && duplicateIswcCodes.has(iswc))) {
      duplicateRowIds.add(row.id);
    }
  }

  return { duplicateRowIds, duplicateIsrcCodes, duplicateIswcCodes };
}