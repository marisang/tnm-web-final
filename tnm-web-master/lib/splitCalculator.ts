
export const SPLIT_PERCENTAGES = {
  oneRpm: 0.3, 
  tnm: 0.2, 
  artista: 0.5, 
  editora: 0.25, 
} as const;

export interface SplitCalculationInput {
  
  valorBrutoONErpm: number;
 
  temVinculoEditorial?: boolean;
}

export interface SplitCalculationResult {
  valorBrutoONErpm: number;
  
  parteONErpm: number;

  parteTNM: number;
  
  parteArtistaBruta: number;
 
  parteEditora: number;
 
  parteArtistaLiquida: number;
  
  totalRepassadoPelaONErpm: number;
}

export function calculateSplit({
  valorBrutoONErpm,
  temVinculoEditorial = false,
}: SplitCalculationInput): SplitCalculationResult {
  const parteONErpm = valorBrutoONErpm * SPLIT_PERCENTAGES.oneRpm;
  const parteTNM = valorBrutoONErpm * SPLIT_PERCENTAGES.tnm;
  const parteArtistaBruta = valorBrutoONErpm * SPLIT_PERCENTAGES.artista;

  const parteEditora = temVinculoEditorial
    ? parteArtistaBruta * SPLIT_PERCENTAGES.editora
    : 0;
  const parteArtistaLiquida = parteArtistaBruta - parteEditora;

  const totalRepassadoPelaONErpm = parteTNM + parteArtistaBruta;

  return {
    valorBrutoONErpm,
    parteONErpm,
    parteTNM,
    parteArtistaBruta,
    parteEditora,
    parteArtistaLiquida,
    totalRepassadoPelaONErpm,
  };
}