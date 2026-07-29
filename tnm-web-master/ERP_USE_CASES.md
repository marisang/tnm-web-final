# Casos de Uso - Processador de PDFs ERP

## 📋 Casos de Uso Reais

### 1. 📊 Relatórios Financeiros

**Cenário**: Empresa recebe relatórios financeiros mensais em PDF de diferentes fornecedores.

**Problema**: Cada fornecedor tem formato diferente, processo manual leva horas.

**Solução**:
```bash
# Processar múltiplos relatórios
npm run process-pdf relatorio_janeiro.pdf -- --output csv --save ./financeiro
npm run process-pdf relatorio_fevereiro.pdf -- --output csv --save ./financeiro
npm run process-pdf relatorio_marco.pdf -- --output csv --save ./financeiro
```

**Resultado**: 
- Dados extraídos automaticamente
- CSVs prontos para importar no Excel/Sistema
- Economia de 80% do tempo de processamento

---

### 2. 📦 Controle de Inventário

**Cenário**: Recebimento de notas fiscais de entrada em PDF.

**Problema**: Precisa atualizar sistema de estoque manualmente.

**Solução**:
1. Upload via interface web (`/erp`)
2. Visualização imediata das tabelas
3. Download em JSON para integração com sistema

**Exemplo de Integração**:
```typescript
// integração-estoque.ts
import { processPDF } from '@/lib/pdfProcessor';

async function atualizarEstoque(pdfBuffer: Buffer) {
  const dados = await processPDF(pdfBuffer, 'nota_fiscal.pdf');
  
  dados.tables.forEach(tabela => {
    tabela.rows.forEach(produto => {
      // Atualiza banco de dados
      await db.produtos.upsert({
        codigo: produto['Código'],
        quantidade: Number(produto['Quantidade']),
        valor: Number(produto['Valor'])
      });
    });
  });
}
```

---

### 3. 🏢 Folha de Pagamento

**Cenário**: RH recebe folhas de pagamento de terceirizados em PDF.

**Problema**: Precisa conferir e consolidar dados de múltiplas empresas.

**Solução**:
```bash
# Script para processar em lote
for file in folhas_pagamento/*.pdf; do
  npm run process-pdf "$file" -- --output both --save ./rh_consolidado --verbose
done
```

**Benefícios**:
- Automatização completa
- Redução de erros humanos
- Auditoria facilitada (JSON preserva estrutura original)

---

### 4. 📈 Análise de Vendas

**Cenário**: Equipe de vendas precisa consolidar relatórios de diferentes regiões.

**Problema**: Cada região usa template diferente.

**Solução**:
```javascript
// Processamento e análise
const regioes = ['sul', 'sudeste', 'norte'];
const consolidado = [];

for (const regiao of regioes) {
  const result = await processPDF(
    fs.readFileSync(`vendas_${regiao}.pdf`),
    `vendas_${regiao}.pdf`
  );
  
  // Detecta automaticamente a estrutura
  if (result.structure.type === 'tabular') {
    consolidado.push(...result.tables[0].rows);
  }
}

// Exporta consolidado
fs.writeFileSync('vendas_total.json', JSON.stringify(consolidado));
```

---

### 5. 🎓 Gestão Acadêmica

**Cenário**: Universidade recebe históricos escolares de alunos transferidos.

**Problema**: Formatos variados de diferentes instituições.

**Solução**:
1. Upload via web interface
2. Sistema identifica automaticamente tipo de estrutura
3. Extrai disciplinas, notas e créditos
4. Permite revisão manual antes de importar

**Interface Customizada**:
```typescript
// Componente específico para históricos
export function HistoricoProcessor() {
  const [dados, setDados] = useState(null);
  
  const handleUpload = async (file) => {
    const result = await processarHistorico(file);
    
    // Valida campos obrigatórios
    const valido = validarHistorico(result);
    
    if (valido) {
      setDados(result);
    } else {
      // Permite edição manual
      setDados({ ...result, needsReview: true });
    }
  };
  
  return (
    <div>
      <FileUpload onUpload={handleUpload} />
      {dados && <HistoricoReview data={dados} />}
    </div>
  );
}
```

---

## 🔧 Integrações Comuns

### Excel / Google Sheets

```bash
# Gerar CSV
npm run process-pdf dados.pdf -- --output csv

# Importar no Excel
# Arquivo > Importar > CSV
```

### Banco de Dados

```typescript
import { processPDF } from '@/lib/pdfProcessor';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importarParaDB(pdfPath: string) {
  const buffer = fs.readFileSync(pdfPath);
  const result = await processPDF(buffer, path.basename(pdfPath));
  
  // Criar registro do documento
  const doc = await prisma.documento.create({
    data: {
      nome: result.fileName,
      tipo: result.structure.type,
      confianca: result.structure.confidence,
      processadoEm: result.processedAt
    }
  });
  
  // Importar tabelas
  for (const tabela of result.tables) {
    await prisma.tabela.create({
      data: {
        documentoId: doc.id,
        headers: tabela.headers,
        dados: tabela.rows
      }
    });
  }
}
```

### API REST

```typescript
// Expor processamento via API
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await processPDF(buffer, file.name);
  
  // Retorna dados em formato padronizado
  return Response.json({
    success: true,
    metadata: {
      fileName: result.fileName,
      structure: result.structure
    },
    data: result.tables.map(t => ({
      headers: t.headers,
      rows: t.rows
    }))
  });
}
```

### Webhooks

```typescript
// Processa PDF quando recebido via webhook
import { processPDF } from '@/lib/pdfProcessor';
import { sendToSlack } from '@/lib/slack';

export async function POST(request: Request) {
  const { fileUrl, source } = await request.json();
  
  // Baixa o PDF
  const response = await fetch(fileUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Processa
  const result = await processPDF(buffer, 'webhook.pdf');
  
  // Notifica equipe
  await sendToSlack({
    text: `Novo PDF processado de ${source}`,
    attachments: [{
      title: result.fileName,
      fields: [
        { title: 'Tipo', value: result.structure.type },
        { title: 'Tabelas', value: String(result.tables.length) },
        { title: 'Confiança', value: `${(result.structure.confidence * 100).toFixed(0)}%` }
      ]
    }]
  });
  
  return Response.json({ success: true });
}
```

---

## 🎯 Workflows Automatizados

### Workflow 1: Email → Processar → Notificar

```typescript
// Monitora emails com PDFs anexados
import { ImapFlow } from 'imapflow';

async function monitorarEmails() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: 'email@empresa.com', pass: 'senha' }
  });
  
  await client.connect();
  
  for await (const message of client.fetch('UNSEEN', { source: true })) {
    const attachments = extrairAnexos(message);
    
    for (const anexo of attachments) {
      if (anexo.filename.endsWith('.pdf')) {
        // Processa PDF
        const result = await processPDF(anexo.content, anexo.filename);
        
        // Salva no sistema
        await salvarResultado(result);
        
        // Notifica responsável
        await enviarNotificacao(result);
      }
    }
  }
}
```

### Workflow 2: Upload → Validar → Aprovar → Integrar

```typescript
// Pipeline completo de processamento
async function processarDocumento(file: File) {
  // 1. Processar
  const result = await processPDF(
    Buffer.from(await file.arrayBuffer()),
    file.name
  );
  
  // 2. Validar
  const validacao = await validarDados(result);
  
  if (!validacao.valido) {
    return { status: 'erro', motivo: validacao.erros };
  }
  
  // 3. Criar registro para aprovação
  const registro = await db.pendencias.create({
    data: {
      arquivo: file.name,
      dados: result,
      status: 'AGUARDANDO_APROVACAO'
    }
  });
  
  // 4. Notificar aprovador
  await notificarAprovador(registro.id);
  
  return { status: 'pendente', registroId: registro.id };
}

// Endpoint de aprovação
async function aprovarDocumento(registroId: string) {
  const registro = await db.pendencias.findUnique({
    where: { id: registroId }
  });
  
  // Integra com sistema final
  await integrarComERP(registro.dados);
  
  // Atualiza status
  await db.pendencias.update({
    where: { id: registroId },
    data: { status: 'APROVADO' }
  });
}
```

---

## 📊 Métricas e Monitoramento

### Tracking de Processamento

```typescript
// lib/metrics.ts
export async function registrarProcessamento(result: ProcessedPDFData) {
  await db.metricas.create({
    data: {
      arquivo: result.fileName,
      tipo: result.structure.type,
      confianca: result.structure.confidence,
      numTabelas: result.tables.length,
      numLinhas: result.tables.reduce((sum, t) => sum + t.rows.length, 0),
      tempoProcessamento: Date.now() - result.processedAt.getTime()
    }
  });
}

// Dashboard de métricas
export async function obterEstatisticas() {
  return {
    totalProcessados: await db.metricas.count(),
    porTipo: await db.metricas.groupBy({
      by: ['tipo'],
      _count: true
    }),
    mediaConfianca: await db.metricas.aggregate({
      _avg: { confianca: true }
    }),
    tempoMedio: await db.metricas.aggregate({
      _avg: { tempoProcessamento: true }
    })
  };
}
```

---

## 🔒 Segurança e Compliance

### Sanitização de Dados Sensíveis

```typescript
function sanitizarDados(result: ProcessedPDFData): ProcessedPDFData {
  const camposSensiveis = ['CPF', 'CNPJ', 'Telefone', 'Email'];
  
  return {
    ...result,
    tables: result.tables.map(table => ({
      ...table,
      rows: table.rows.map(row => {
        const sanitized = { ...row };
        
        table.headers.forEach(header => {
          if (camposSensiveis.includes(header)) {
            sanitized[header] = mascarar(String(row[header]));
          }
        });
        
        return sanitized;
      })
    }))
  };
}

function mascarar(valor: string): string {
  if (valor.includes('@')) {
    // Email: u***@email.com
    const [user, domain] = valor.split('@');
    return `${user[0]}***@${domain}`;
  }
  
  // Outros: mostrar apenas últimos 4 dígitos
  return '*'.repeat(valor.length - 4) + valor.slice(-4);
}
```

### Auditoria

```typescript
async function registrarAcesso(
  userId: string,
  action: string,
  documentId: string
) {
  await db.auditoria.create({
    data: {
      usuario: userId,
      acao: action,
      documento: documentId,
      timestamp: new Date(),
      ip: obterIP()
    }
  });
}
```

---

## 🚀 Performance

### Processamento em Lote

```typescript
import { Pool } from 'generic-pool';

// Pool de workers
const workerPool = Pool.create({
  create: () => new Worker('./pdf-worker.js'),
  destroy: (worker) => worker.terminate(),
  max: 4,
  min: 2
});

async function processarEmLote(arquivos: File[]) {
  const resultados = await Promise.all(
    arquivos.map(async (arquivo) => {
      const worker = await workerPool.acquire();
      
      try {
        return await worker.process(arquivo);
      } finally {
        await workerPool.release(worker);
      }
    })
  );
  
  return resultados;
}
```

### Cache de Resultados

```typescript
import { Redis } from 'ioredis';

const redis = new Redis();

async function processarComCache(fileHash: string, buffer: Buffer, fileName: string) {
  // Verifica cache
  const cached = await redis.get(`pdf:${fileHash}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Processa
  const result = await processPDF(buffer, fileName);
  
  // Salva no cache (24 horas)
  await redis.setex(`pdf:${fileHash}`, 86400, JSON.stringify(result));
  
  return result;
}
```

---

## 📚 Recursos Adicionais

- [Documentação Completa](./ERP_README.md)
- [Guia Rápido](./ERP_QUICKSTART.md)
- [Exemplos de Teste](./test-data/README.md)

---

**Tem um caso de uso diferente?** Contribua com exemplos para ajudar outros usuários!
