# Guia Rápido - Processador de PDFs

## 🚀 Início Rápido

### 1. Instalar Dependências (se necessário)
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 3. Acessar a Interface Web
Abra o navegador em: **http://localhost:3000/erp**

## 📖 Uso da Interface Web

1. **Upload**
   - Clique na área de upload ou arraste um arquivo PDF
   - Máximo: 10MB
   - Apenas arquivos PDF

2. **Processar**
   - Clique em "Processar PDF"
   - Aguarde a análise automática

3. **Visualizar**
   - Veja as informações do documento
   - Navegue pelas tabelas extraídas
   - Baixe os dados em CSV ou JSON

## 💻 Uso via Linha de Comando

### Processar um PDF
```bash
npm run process-pdf documento.pdf
```

### Com opções
```bash
# Salvar como CSV
npm run process-pdf documento.pdf -- --output csv --save ./meus-dados

# Salvar ambos (JSON + CSV)
npm run process-pdf documento.pdf -- --output both --save ./exports

# Modo verbose (mais detalhes)
npm run process-pdf documento.pdf -- --verbose
```

### Ajuda
```bash
npm run process-pdf -- --help
```

## 📊 Estruturas Suportadas

### ✅ Tabelas com Colunas Alinhadas
```
Nome      Idade    Cidade
João      25       São Paulo
Maria     30       Rio
```

### ✅ Formulários (Chave: Valor)
```
Nome: João Silva
Idade: 25
Cidade: São Paulo
```

### ✅ Tabelas com Separadores
```
Nome | Idade | Cidade
João | 25    | São Paulo
Maria | 30   | Rio
```

### ✅ Estruturas Mistas
Combinação de tabelas e formulários no mesmo documento.

## 🎯 Exemplos de Teste

### Gerar Dados de Teste
```bash
npx tsx scripts/test-data-generator.ts
```

Isso criará exemplos em `test-data/`:
- `exemplo_tabular.txt` - Tabela simples
- `exemplo_form.txt` - Formulário
- `exemplo_mixed.txt` - Estrutura mista
- `exemplo_complex.txt` - Tabela complexa

### Converter para PDF
Use qualquer ferramenta para converter os arquivos `.txt` para `.pdf`:
- **Online**: https://txt2pdf.com
- **Windows**: Imprimir > Microsoft Print to PDF
- **Linux**: `txt2pdf` ou LibreOffice
- **Mac**: TextEdit > Exportar como PDF

### Testar
```bash
npm run process-pdf test-data/exemplo_tabular.pdf -- --verbose
```

## 📤 Formatos de Exportação

### JSON (Completo)
Inclui todos os metadados e estrutura:
```json
{
  "fileName": "documento.pdf",
  "pageCount": 1,
  "structure": {
    "type": "tabular",
    "confidence": 0.85,
    "detectedPatterns": ["multiple_columns", "numeric_data"]
  },
  "tables": [...]
}
```

### CSV (Por Tabela)
Cada tabela é exportada separadamente:
```csv
Nome,Idade,Cidade
João,25,São Paulo
Maria,30,Rio de Janeiro
```

## 🔍 Interpretando os Resultados

### Tipo de Estrutura
- **tabular**: Dados organizados em tabelas
- **form**: Pares chave-valor (formulários)
- **mixed**: Combinação de ambos

### Confiança
- **> 70%**: Alta confiança, estrutura bem definida
- **50-70%**: Média confiança, pode ter inconsistências
- **< 50%**: Baixa confiança, estrutura complexa ou ambígua

### Padrões Detectados
- `multiple_columns`: Múltiplas colunas identificadas
- `numeric_data`: Dados numéricos presentes
- `explicit_separators`: Separadores claros (|, tabs)
- `table_headers`: Cabeçalhos de tabela detectados
- `form_structure`: Estrutura de formulário (campo: valor)

## ⚠️ Limitações

### ❌ Não Suportado
- PDFs escaneados (imagens) - requer OCR
- Tabelas com células mescladas
- Formatação muito complexa
- Múltiplas tabelas sobrepostas

### ✅ Melhores Resultados
- PDFs gerados digitalmente
- Tabelas com separadores claros
- Estrutura consistente
- Uma tabela por vez

## 🐛 Resolução de Problemas

### Nenhuma tabela detectada
- **Causa**: Estrutura muito complexa ou PDF escaneado
- **Solução**: Verifique o JSON bruto, ajuste o PDF ou use OCR

### Colunas misturadas
- **Causa**: Alinhamento inconsistente
- **Solução**: Use separadores explícitos (tabs ou |)

### Dados incorretos
- **Causa**: Espaçamento irregular
- **Solução**: Padronize o espaçamento entre colunas

### Erro de upload
- **Causa**: Arquivo muito grande ou formato inválido
- **Solução**: Verifique o tamanho (max 10MB) e formato (PDF)

## 📚 Recursos Adicionais

- **Documentação Completa**: [ERP_README.md](./ERP_README.md)
- **Exemplos de Teste**: [test-data/README.md](./test-data/README.md)
- **Código Fonte**: [lib/pdfProcessor.ts](./lib/pdfProcessor.ts)

## 🆘 Suporte

### Problemas Comuns
1. Verifique se o PDF não está protegido por senha
2. Confirme que o arquivo foi gerado digitalmente (não escaneado)
3. Teste com os exemplos fornecidos primeiro
4. Use o modo `--verbose` para mais informações

### Logs de Erro
```bash
# CLI com verbose
npm run process-pdf arquivo.pdf -- --verbose

# Web (console do navegador)
Abra DevTools > Console (F12)
```

## 🎨 Personalização

### Ajustar Limites
Edite `app/api/process-pdf/route.ts`:
```typescript
const maxSize = 10 * 1024 * 1024; // Altere para seu limite
```

### Adicionar Novos Padrões
Edite `lib/pdfProcessor.ts`:
```typescript
function identifyStructure(text: string): PDFStructure {
  // Adicione seus padrões aqui
}
```

### Customizar UI
Edite `components/PDFProcessor.tsx` para alterar a interface.

## 🚀 Próximos Passos

1. ✅ Teste com os exemplos fornecidos
2. ✅ Processe seus próprios PDFs
3. ✅ Experimente as exportações
4. 📖 Leia a documentação completa
5. 🛠️ Customize conforme necessário

---

**Dúvidas?** Consulte [ERP_README.md](./ERP_README.md) para documentação detalhada.
