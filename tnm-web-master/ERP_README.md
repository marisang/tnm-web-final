# Sistema de Processamento de PDFs (ERP)

## 📋 Descrição

Sistema completo para processar planilhas em PDF, com identificação automática de estrutura, extração de dados e exportação em múltiplos formatos.

## 🚀 Funcionalidades

### Processamento Automático
- **Identificação de Estrutura**: Detecta automaticamente se o PDF contém:
  - Dados tabulares (planilhas)
  - Formulários (pares chave-valor)
  - Estrutura mista
  
- **Detecção de Padrões**:
  - Múltiplas colunas
  - Separadores (pipes, tabs, espaços múltiplos)
  - Dados numéricos
  - Cabeçalhos de tabela
  - Pares chave-valor

### Extração de Dados
- Extração automática de tabelas
- Reconhecimento de cabeçalhos
- Conversão automática de tipos (números vs strings)
- Suporte para múltiplas tabelas no mesmo PDF

### Exportação
- **JSON**: Dados completos com metadados
- **CSV**: Cada tabela pode ser exportada individualmente
- Metadados incluem: tipo de estrutura, confiança, padrões detectados

## 📁 Estrutura do Projeto

```
app/
├── api/
│   └── process-pdf/
│       └── route.ts          # API endpoint para processar PDFs
└── erp/
    └── page.tsx              # Página principal do ERP

components/
└── PDFProcessor.tsx          # Componente React de upload e visualização

lib/
└── pdfProcessor.ts           # Lógica de processamento de PDFs

types/
└── pdf-processor.ts          # Definições TypeScript
```

## 🔧 Tecnologias Utilizadas

- **Next.js 16**: Framework React
- **TypeScript**: Tipagem estática
- **pdf-parse**: Parsing de PDFs
- **Tailwind CSS**: Estilização

## 📖 Como Usar

### 1. Acessar a Interface

Navegue para: `http://localhost:3000/erp`

### 2. Upload de PDF

1. Clique na área de upload ou arraste o arquivo
2. Selecione um arquivo PDF (máximo 10MB)
3. Clique em "Processar PDF"

### 3. Visualizar Resultados

O sistema mostrará:
- **Informações do Documento**:
  - Nome do arquivo
  - Número de páginas
  - Tipo de estrutura detectado
  - Nível de confiança da detecção
  - Padrões identificados

- **Tabelas Extraídas**:
  - Visualização em tabela HTML
  - Número de linhas e colunas
  - Botão para download em CSV

### 4. Exportar Dados

- **CSV Individual**: Clique em "Baixar CSV" em cada tabela
- **JSON Completo**: Clique em "Baixar JSON Completo" para todos os dados

## 🎯 Estrutura de Dados

### PDFStructure
```typescript
{
  type: 'tabular' | 'form' | 'mixed',
  confidence: number,  // 0 a 1
  detectedPatterns: string[]
}
```

### ExtractedTable
```typescript
{
  headers: string[],
  rows: Array<Record<string, string | number>>,
  metadata: {
    tableIndex: number,
    startRow: number,
    endRow: number,
    columnCount: number,
    rowCount: number
  }
}
```

## 🔍 Algoritmo de Detecção

### 1. Análise de Estrutura
```typescript
// Detecta padrões tabulares
- Múltiplas colunas (espaços repetidos)
- Separadores explícitos (|, \t)
- Dados numéricos (formato decimal)
- Cabeçalhos de tabela

// Detecta padrões de formulário
- Labels com dois-pontos
- Pares chave-valor
```

### 2. Extração de Tabelas
```typescript
// Para cada linha:
1. Identifica separadores de coluna
2. Primeira linha com N colunas = cabeçalho
3. Linhas seguintes com N colunas = dados
4. Mudança no número de colunas = nova tabela
```

### 3. Conversão de Tipos
```typescript
// Tenta converter valores para número
const numValue = parseFloat(value.replace(',', '.'));
row[header] = isNaN(numValue) ? value : numValue;
```

## 📊 Exemplos de Uso

### PDF com Tabela Simples
```
Nome      Idade    Cidade
João      25       São Paulo
Maria     30       Rio de Janeiro
```

Resultado:
```json
{
  "headers": ["Nome", "Idade", "Cidade"],
  "rows": [
    {"Nome": "João", "Idade": 25, "Cidade": "São Paulo"},
    {"Nome": "Maria", "Idade": 30, "Cidade": "Rio de Janeiro"}
  ]
}
```

### PDF com Formulário
```
Nome: João Silva
Idade: 25
Cidade: São Paulo
```

Resultado:
```json
{
  "headers": ["Campo", "Valor"],
  "rows": [
    {"Campo": "Nome", "Valor": "João Silva"},
    {"Campo": "Idade", "Valor": 25},
    {"Campo": "Cidade", "Valor": "São Paulo"}
  ]
}
```

## 🔐 Segurança

- Validação de tipo de arquivo (apenas PDFs)
- Limite de tamanho: 10MB
- Processamento server-side
- Validação de entrada

## ⚙️ API Endpoint

### POST /api/process-pdf

**Request:**
```typescript
FormData {
  file: File  // Arquivo PDF
}
```

**Response:**
```typescript
{
  success: boolean,
  data?: ProcessedPDFData,
  error?: string
}
```

## 🐛 Tratamento de Erros

- Arquivo não enviado
- Tipo de arquivo inválido
- Tamanho excedido
- Erro no parsing do PDF
- Estrutura não reconhecida

## 🚀 Melhorias Futuras

- [ ] Suporte para OCR em PDFs escaneados
- [ ] Detecção de tabelas complexas (células mescladas)
- [ ] Suporte para múltiplos idiomas
- [ ] Cache de resultados processados
- [ ] Processamento em lote (múltiplos PDFs)
- [ ] Visualização de preview do PDF
- [ ] Edição manual dos dados extraídos
- [ ] Exportação para Excel (XLSX)
- [ ] Templates personalizados de extração
- [ ] API para integração com outros sistemas

## 📝 Notas de Desenvolvimento

### Limitações Conhecidas
- PDFs com layout complexo podem não ser reconhecidos corretamente
- PDFs escaneados (imagens) requerem OCR (não implementado)
- Tabelas muito grandes podem impactar performance

### Dicas para Melhores Resultados
- Use PDFs gerados digitalmente (não escaneados)
- Prefira tabelas com separadores claros
- Evite formatação complexa (células mescladas, etc.)

## 🤝 Contribuindo

Para adicionar novos padrões de detecção:
1. Edite `lib/pdfProcessor.ts`
2. Adicione o padrão em `identifyStructure()`
3. Implemente a lógica de extração em `extractTables()`

## 📄 Licença

Este projeto é parte do sistema TNM Web.
