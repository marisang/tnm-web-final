
# Dados de Teste - Processador de PDFs

Este diretório contém exemplos de estruturas de dados que o processador consegue identificar.

## Arquivos

### exemplo_tabular.txt
Demonstra uma tabela simples com colunas alinhadas por espaços.
- Estrutura: Tabular
- Colunas: Produto, Quantidade, Valor Unit, Total
- Padrões: multiple_columns, numeric_data, table_headers

### exemplo_form.txt
Demonstra um formulário com pares chave-valor.
- Estrutura: Form
- Padrões: form_structure
- Campos: Nome, CPF, Data de Nascimento, etc.

### exemplo_mixed.txt
Demonstra uma estrutura mista com múltiplas tabelas e informações de contexto.
- Estrutura: Mixed
- Contém: Tabelas de receitas e despesas + informações gerais
- Padrões: multiple_columns, form_structure, table_headers, numeric_data

### exemplo_complex.txt
Demonstra uma tabela complexa com múltiplas colunas e dados diversos.
- Estrutura: Tabular
- Colunas: Código, Descrição, Categoria, Qtd, Valor, Fornecedor
- Observações adicionais no rodapé

## Como Usar

Para testar o processador com estes arquivos:

1. **Converter para PDF** (use qualquer ferramenta online ou software)
2. **Processar via Web**:
   ```bash
   npm run dev
   # Acesse http://localhost:3000/erp
   ```

3. **Processar via CLI**:
   ```bash
   npm run process-pdf exemplo_tabular.pdf
   npm run process-pdf exemplo_form.pdf --output both
   npm run process-pdf exemplo_mixed.pdf --verbose
   ```

## Resultados Esperados

### Tabular
- Tipo: tabular
- Confiança: > 70%
- Tabelas extraídas: 1-2
- Headers detectados automaticamente

### Form
- Tipo: form
- Confiança: > 60%
- Tabelas extraídas: 1 (com campos e valores)
- Formato: Campo | Valor

### Mixed
- Tipo: mixed
- Confiança: 50-80%
- Tabelas extraídas: 2-3
- Múltiplas estruturas identificadas

## Dicas

- PDFs gerados digitalmente funcionam melhor
- Mantenha alinhamento consistente nas colunas
- Use separadores claros (espaços múltiplos, tabs, pipes)
- Evite formatação complexa (células mescladas, bordas)
