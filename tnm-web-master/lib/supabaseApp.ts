import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_APP_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_APP_ANON_KEY!;

export const supabaseApp = createClient(supabaseUrl, supabaseAnonKey);

// Tabelas do banco APP (conforme schema das imagens)
export interface Artista {
  id: string;
  nome_completo: string;
  pseudonimo_artistico: string;
  cpf: string;
  rg?: string;
  orgao_emissor?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  estado_civil?: string;
  profissao?: string;
  email: string;
  celular: string;
  endereco_completo?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
}

export interface Show {
  id: string;
  titulo_evento: string;
  data_evento: string;
  local_nome: string;
  banner_url?: string;
  link_ingressos?: string;
  contato_whatsapp?: string;
  release_texto?: string;
  status_publicacao: string;
  artista_id: string;
  usuario_id?: string;
}

export interface Obra {
  id: string;
  titulo: string;
  isrc?: string;
  letra?: string;
  status: string;
  artista_id: string;
  album_id?: string;
}

export interface Contrato {
  id: string;
  tipo_contrato: string;
  status: string;
  artista_id: string;
}

export interface Compositor {
  id: string;
  nome: string;
  cpf?: string;
  obra_id: string;
}

export interface Album {
  id: string;
  titulo: string;
  capa_url?: string;
  data_lancamento?: string;
}

export interface TransacaoFinanceira {
  id: string;
  origem_receita: string;
  valor_arrecadado: number;
  valor_repasse: number;
  data_competencia: string;
  artista_id: string;
}
