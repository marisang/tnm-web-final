# Sistema ERP - Processador de PDFs

## 🎯 Visão Geral

Sistema completo e automatizado para processamento de planilhas e documentos em formato PDF, com capacidade de identificar estruturas automaticamente e extrair dados organizados.

## ✨ Características Principais

### 🤖 Detecção Automática Inteligente
- Identifica automaticamente o tipo de estrutura (tabular, formulário ou misto)
- Detecta padrões como colunas múltiplas, separadores, dados numéricos
- Calcula nível de confiança da identificação
- Não requer configuração prévia ou templates

### 📊 Extração de Dados
- Extrai tabelas completas com cabeçalhos
- Reconhece e converte tipos de dados (números, strings)
- Suporta múltiplas tabelas no mesmo documento
- Extrai formulários com pares chave-valor
- Preserva estrutura e metadados

### 💾 Múltiplos Formatos de Exportação
- **JSON**: Dados completos com metadados estruturais
- **CSV**: Cada tabela exportada individualmente
- **Raw Text**: Texto original para análise customizada

### 🌐 Duas Interfaces de Uso
1. **Interface Web**: Upload e visualização interativa
2. **CLI**: Processamento em lote via linha de comando

## 📦 O que foi Implementado

### Arquivos Criados

```
📁 app/
├── 📁 api/process-pdf/
│   └── 📄 route.ts                    # API endpoint para processar PDFs
└── 📁 erp/
    └── 📄 page.tsx                    # Página principal do ERP

📁 components/
└── 📄 PDFProcessor.tsx                # Componente React de interface

📁 lib/
└── 📄 pdfProcessor.ts                 # Motor de processamento

📁 types/
└── 📄 pdf-processor.ts                # Tipos TypeScript

📁 scripts/
├── 📄 process-pdf-cli.ts              # Script CLI
└── 📄 test-data-generator.ts          # Gerador de dados de teste

📁 test-data/
├── 📄 README.md
├── 📄 exemplo_tabular.txt
├── 📄 exemplo_form.txt
├── 📄 exemplo_mixed.txt
└── 📄 exemplo_complex.txt

📁 documentação/
├── 📄 ERP_README.md                   # Documentação completa
├── 📄 ERP_QUICKSTART.md              # Guia rápido
├── 📄 ERP_USE_CASES.md               # Casos de uso reais
└── 📄 ERP_OVERVIEW.md                # Este arquivo
```

## 🚀 Como Usar

### Início Rápido (Web)
```bash
# 1. Iniciar servidor
npm run dev

# 2. Acessar navegador
http://localhost:3000/erp

# 3. Fazer upload do PDF e processar
```

### Início Rápido (CLI)
```bash
# Processar um PDF
npm run process-pdf documento.pdf

# Com opções
npm run process-pdf documento.pdf -- --output both --verbose
```

## 🔍 Como Funciona

### 1. Upload / Leitura do PDF
```
PDF → Buffer → Parser → Texto Raw
```

### 2. Análise de Estrutura
```typescript
Texto → Análise de Padrões → {
  type: 'tabular' | 'form' | 'mixed',
  confidence: 0.85,
  detectedPatterns: [...]
}
```

### 3. Extração de Dados
```typescript
Texto + Estrutura → Algoritmo de Extração → {
  headers: ['Col1', 'Col2', 'Col3'],
  rows: [{Col1: 'val1', Col2: 'val2', ...}],
  metadata: {...}
}
```

### 4. Exportação
```typescript
Dados Extraídos → Formatação → JSON / CSV / Texto
```

## 📊 Algoritmo de Detecção

### Padrões Identificados

1. **Múltiplas Colunas** (Score: +0.3)
   - Detecta espaços repetidos entre valores
   - Identifica alinhamento vertical

2. **Dados Numéricos** (Score: +0.2)
   - Reconhece padrões numéricos
   - Formatos: 1234.56, 1.234,56

3. **Separadores Explícitos** (Score: +0.4)
   - Pipes: `|`
   - Tabs: `\t`
   - Espaços múltiplos: `   `

4. **Cabeçalhos** (Score: +0.4)
   - Primeira linha com 2-10 palavras
   - Padrão consistente com linhas seguintes

5. **Formulários** (Score: +0.3)
   - Padrão: `Chave: Valor`
   - Labels seguidos de dois-pontos

### Cálculo de Confiança

```typescript
confiança = min(soma_dos_scores, 1.0)

if (confiança >= 0.7 && tem_separadores) {
  tipo = 'tabular'
} else if (tem_chave_valor && !tem_colunas) {
  tipo = 'form'
} else {
  tipo = 'mixed'
}
```

## 🎨 Interface Web

### Recursos da UI
- ✅ Drag & drop para upload
- ✅ Visualização em tempo real
- ✅ Tabelas renderizadas em HTML
- ✅ Download individual (CSV por tabela)
- ✅ Download completo (JSON)
- ✅ Informações detalhadas do documento
- ✅ Indicadores visuais de confiança
- ✅ Badges de padrões detectados

### Tecnologias
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

## 💻 CLI - Linha de Comando

### Comandos Disponíveis

```bash
# Básico
npm run process-pdf arquivo.pdf

# JSON
npm run process-pdf arquivo.pdf -- --output json

# CSV
npm run process-pdf arquivo.pdf -- --output csv

# Ambos
npm run process-pdf arquivo.pdf -- --output both

# Diretório customizado
npm run process-pdf arquivo.pdf -- --save ./meus-dados

# Modo detalhado
npm run process-pdf arquivo.pdf -- --verbose

# Ajuda
npm run process-pdf -- --help
```

### Saída CLI

```
📄 Processando PDF...
   Arquivo: relatorio.pdf
   Formato: json
   Destino: ./output

✅ Processamento concluído!
   Tempo: 156ms
   Páginas: 1
   Tipo: tabular
   Confiança: 85.0%
   Tabelas encontradas: 1

💾 Arquivos salvos: 1
   - ./output/relatorio_processed.json

✨ Pronto!
```

## 📈 Casos de Uso

### ✅ Ideais para o Sistema
- Relatórios financeiros
- Notas fiscais
- Inventários
- Folhas de pagamento
- Listas de produtos
- Cadastros
- Históricos escolares
- Planilhas gerenciais

### ⚠️ Limitações
- PDFs escaneados (requer OCR)
- Tabelas com células mescladas
- Layouts muito complexos
- Gráficos e imagens

## 🔐 Segurança

### Validações Implementadas
- ✅ Tipo de arquivo (apenas PDF)
- ✅ Tamanho máximo (10MB)
- ✅ Processamento server-side
- ✅ Sanitização de entrada

### Recomendações
- Implementar autenticação para produção
- Adicionar rate limiting
- Configurar CORS apropriadamente
- Implementar sanitização de dados sensíveis
- Adicionar logging de auditoria

## 📦 Dependências Instaladas

```json
{
  "dependencies": {
    "pdf-parse": "^1.1.1",    // Parser de PDFs
    "xlsx": "^0.18.5"         // Manipulação de planilhas
  },
  "devDependencies": {
    "@types/pdf-parse": "^1.1.4",
    "tsx": "^4.7.0"           // Executar TypeScript
  }
}
```

## 🚀 Próximos Passos Sugeridos

### Curto Prazo
- [ ] Testes com PDFs reais
- [ ] Ajustar algoritmos conforme feedback
- [ ] Adicionar mais padrões de detecção
- [ ] Melhorar UI/UX

### Médio Prazo
- [ ] Implementar OCR para PDFs escaneados
- [ ] Suporte para tabelas complexas
- [ ] Sistema de templates customizados
- [ ] API para integrações
- [ ] Processamento em lote (múltiplos PDFs)

### Longo Prazo
- [ ] Machine Learning para melhor detecção
- [ ] Suporte para outros formatos (XLSX, DOCX)
- [ ] Dashboard de analytics
- [ ] Sistema de filas para processamento
- [ ] Plugins para extensibilidade

## 📚 Documentação

### Arquivos de Documentação
1. **ERP_OVERVIEW.md** (este arquivo) - Visão geral do sistema
2. **ERP_README.md** - Documentação técnica completa
3. **ERP_QUICKSTART.md** - Guia rápido de uso
4. **ERP_USE_CASES.md** - Exemplos práticos e integrações

### Recursos de Aprendizado
- Exemplos de teste em `test-data/`
- Scripts comentados em `scripts/`
- Código documentado com JSDoc
- Tipos TypeScript auto-documentados

## 🎓 Conceitos Técnicos

### Pattern Matching
O sistema usa análise de padrões para identificar estruturas sem necessidade de configuração prévia.

### Heurísticas
Algoritmos heurísticos calculam probabilidades de cada tipo de estrutura baseado em múltiplos indicadores.

### Type Inference
Conversão automática de tipos (string → number) baseada em conteúdo.

### Metadata Preservation
Mantém informações sobre origem, posição e contexto dos dados extraídos.

## 🤝 Contribuindo

### Como Melhorar o Sistema

1. **Novos Padrões**: Edite `lib/pdfProcessor.ts`
2. **UI**: Customize `components/PDFProcessor.tsx`
3. **Validações**: Adicione em `app/api/process-pdf/route.ts`
4. **Exportação**: Novas funções em `lib/pdfProcessor.ts`

### Áreas para Contribuição
- Novos algoritmos de detecção
- Suporte para novos formatos
- Melhorias de performance
- Testes automatizados
- Documentação

## ❓ FAQ

**P: Funciona com PDFs escaneados?**
R: Não no momento. Requer OCR (planejado para futuro).

**P: Qual o tamanho máximo?**
R: 10MB por padrão, configurável em `route.ts`.

**P: Posso processar múltiplos arquivos?**
R: Sim, use CLI em loop ou implemente processamento em lote.

**P: Como integrar com meu sistema?**
R: Use a API REST em `/api/process-pdf` ou importe a lib diretamente.

**P: É possível customizar a detecção?**
R: Sim, edite `identifyStructure()` em `lib/pdfProcessor.ts`.

## 📞 Suporte

### Problemas Comuns
- Ver [ERP_QUICKSTART.md](./ERP_QUICKSTART.md) seção "Resolução de Problemas"
- Verificar logs com `--verbose`
- Testar com exemplos fornecidos primeiro

### Debug
```bash
# CLI
npm run process-pdf arquivo.pdf -- --verbose

# Web
# Abrir DevTools > Console (F12)
```

## 🎉 Conclusão

Sistema completo e pronto para uso, com:
- ✅ Detecção automática inteligente
- ✅ Interface web moderna
- ✅ CLI para automação
- ✅ Múltiplos formatos de exportação
- ✅ Documentação completa
- ✅ Exemplos práticos
- ✅ Código bem estruturado
- ✅ TypeScript com tipos completos

**Pronto para processar seus PDFs!** 🚀

---

Documentação criada em: Julho 2026
Versão: 1.0.0
