/**
 * Tipos do banco WEB (administrativo), conforme o esquema em
 * Esquema_DB_WEB.jpeg — tratado como fonte de verdade.
 *
 * Tabelas: usuarios, obras, fonogramas, importacoes, receitas,
 * receitas_repasses, repasses_obras, repasses_fonogramas.
 *
 * Observação de arquitetura: o projeto WEB e o projeto APP (usado pelo
 * tnm-mobile, ver lib/supabaseApp.ts) são bancos Supabase distintos
 * (URLs/chaves diferentes). A tabela `obras` deste banco guarda
 * `nome_titular` e `pseudonimo` como texto (dado bruto vindo dos
 * relatórios importados da ONErpm/ECAD/ABRAMUS), e `artista_id` é uma
 * referência lógica ao `artistas.id` do banco APP — não uma FK de
 * banco, já que são projetos diferentes.
 */

export type CargoUsuario = 'admin' | 'financeiro' | 'operacional';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  /** Hash da senha — nunca é lido/gravado pelo frontend (gerenciado pelo Supabase Auth). */
  senha?: string;
  cargo: CargoUsuario | string;
}

export interface Obra {
  id: number;
  iswc?: string | null;
  titulo_principal: string;
  data_cadastro?: string | null;
  nome_titular?: string | null;
  pseudonimo?: string | null;
  /** Percentual da categoria de direito autoral aplicado a esta obra. */
  percentual_cat?: number | null;
  artista_id?: string | null;
  importacao_id?: number | null;
}

export interface Fonograma {
  id: number;
  isrc?: string | null;
  titulo_principal: string;
  data_cadastro?: string | null;
  participante?: string | null;
  pseudonimo?: string | null;
  categoria?: string | null;
  percentual_part?: number | null;
  artista_id?: string | null;
  obra_id?: number | null;
  importacao_id?: number | null;
}

export type OrigemImportacao = 'onerpm' | 'ecad' | 'abramus';
export type StatusImportacao = 'processando' | 'concluida' | 'erro';

export interface Importacao {
  id: number;
  data_importacao: string;
  status: StatusImportacao | string;
  onerpm?: string | null;
  abramus_digital?: string | null;
  abramus_execucao_p?: string | null;
  ecad?: string | null;
  usuario_id?: number | null;
}

export interface Receita {
  id: number;
  origem: OrigemImportacao | string;
  competencia?: string | null;
  valor_bruto: number;
  quantidade_streams?: number | null;
  codigo_obra?: string | null;
  status_conciliacao?: string | null;
  importacao_id?: number | null;
}

export interface ReceitaRepasse {
  receita_id: number;
  repasse_obra_id?: number | null;
  repasse_fonograma_id?: number | null;
}

export interface RepasseObra {
  id: number;
  percentual_cat: number;
  valor_repasse: number;
  obra_id: number;
}

export interface RepasseFonograma {
  id: number;
  percentual_part: number;
  valor_repasse: number;
  fonograma_id: number;
}

export interface Database {
  public: {
    Tables: {
      usuarios: { Row: Usuario; Insert: Partial<Usuario>; Update: Partial<Usuario> };
      obras: { Row: Obra; Insert: Partial<Obra>; Update: Partial<Obra> };
      fonogramas: { Row: Fonograma; Insert: Partial<Fonograma>; Update: Partial<Fonograma> };
      importacoes: { Row: Importacao; Insert: Partial<Importacao>; Update: Partial<Importacao> };
      receitas: { Row: Receita; Insert: Partial<Receita>; Update: Partial<Receita> };
      receitas_repasses: { Row: ReceitaRepasse; Insert: Partial<ReceitaRepasse>; Update: Partial<ReceitaRepasse> };
      repasses_obras: { Row: RepasseObra; Insert: Partial<RepasseObra>; Update: Partial<RepasseObra> };
      repasses_fonogramas: { Row: RepasseFonograma; Insert: Partial<RepasseFonograma>; Update: Partial<RepasseFonograma> };
    };
  };
}
