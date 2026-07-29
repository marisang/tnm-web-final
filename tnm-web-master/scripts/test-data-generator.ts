#!/usr/bin/env tsx

/**
 * Gerador de dados de teste para o processador de PDFs
 * Cria exemplos de estruturas que o processador consegue identificar
 */

import * as fs from 'fs';
import * as path from 'path';

const testExamples = {
  tabular: `
RELATÓRIO DE VENDAS - JANEIRO 2024

Produto              Quantidade    Valor Unit    Total
Notebook Dell        15            3500.00       52500.00
Mouse Logitech       50            45.90         2295.00
Teclado Mecânico     30            280.00        8400.00
Monitor LG 27"       20            1200.00       24000.00
Webcam HD            25            150.00        3750.00

Total Geral: R$ 90.945,00
`,

  form: `
CADASTRO DE CLIENTE

Nome: João Silva Santos
CPF: 123.456.789-00
Data de Nascimento: 15/03/1985
Endereço: Rua das Flores, 123
Cidade: São Paulo
Estado: SP
CEP: 01234-567
Telefone: (11) 98765-4321
Email: joao.silva@email.com
Profissão: Engenheiro de Software
Renda Mensal: 15000.00
`,

  mixed: `
RELATÓRIO FINANCEIRO - Q1 2024

Cliente: Empresa XYZ Ltda
CNPJ: 12.345.678/0001-90
Período: Janeiro a Março 2024

RECEITAS
Mês        Vendas       Serviços     Total
Janeiro    150000.00    45000.00     195000.00
Fevereiro  165000.00    52000.00     217000.00
Março      180000.00    48000.00     228000.00

DESPESAS
Categoria           Valor
Salários            120000.00
Aluguel            15000.00
Fornecedores       85000.00
Marketing          25000.00
Outros             10000.00

Resultado: R$ 385.000,00
Margem: 60.3%
`,

  complex: `
INVENTÁRIO DE ESTOQUE - FILIAL SUL

Código    Descrição              Categoria      Qtd    Valor    Fornecedor
PRD001    Notebook Dell XPS      Eletrônicos    45     4500     Dell Brasil
PRD002    Mouse Wireless         Acessórios     120    89       Logitech
PRD003    Teclado Mecânico RGB   Periféricos    68     450      Razer
PRD004    Monitor 4K 32"         Displays       28     2800     LG
PRD005    Webcam Full HD         Vídeo          95     280      Microsoft
PRD006    Headset Gamer          Áudio          110    320      HyperX
PRD007    SSD 1TB NVMe           Storage        200    580      Samsung
PRD008    RAM 16GB DDR4          Memória        150    420      Kingston

Observações:
- Produtos PRD001 e PRD004 necessitam reposição
- Fornecedor Razer com entrega prevista para 15/08
- Promoção ativa em itens da categoria Áudio
`
};

function generateTestFiles() {
  const outputDir = path.join(process.cwd(), 'test-data');
  
  // Cria diretório de teste
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Salva exemplos como arquivos de texto
  Object.entries(testExamples).forEach(([name, content]) => {
    const filePath = path.join(outputDir, `exemplo_${name}.txt`);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Criado: ${filePath}`);
  });
  
  // Cria um README
  const readme = `
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
   \`\`\`bash
   npm run dev
   # Acesse http://localhost:3000/erp
   \`\`\`

3. **Processar via CLI**:
   \`\`\`bash
   npm run process-pdf exemplo_tabular.pdf
   npm run process-pdf exemplo_form.pdf --output both
   npm run process-pdf exemplo_mixed.pdf --verbose
   \`\`\`

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
`;
  
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  console.log(`✅ Criado: ${path.join(outputDir, 'README.md')}`);
  
  console.log('\n✨ Dados de teste criados com sucesso!');
  console.log(`📁 Localização: ${outputDir}`);
  console.log('\n💡 Próximos passos:');
  console.log('   1. Converta os arquivos .txt para .pdf');
  console.log('   2. Use npm run process-pdf para testar');
  console.log('   3. Ou acesse http://localhost:3000/erp para testar na web\n');
}

// Executa
generateTestFiles();
