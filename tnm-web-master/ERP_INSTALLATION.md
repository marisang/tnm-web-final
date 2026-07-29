# 📦 Guia de Instalação - Sistema ERP

## ✅ Status: Sistema Instalado e Funcional

O sistema já está completamente instalado e pronto para uso!

## 🔍 Verificação de Instalação

### ✅ Dependências Instaladas
```bash
✓ pdf-parse - Parser de PDFs
✓ xlsx - Manipulação de planilhas
✓ @types/pdf-parse - Tipos TypeScript
✓ tsx - Executor de scripts TypeScript
```

### ✅ Arquivos Criados
```bash
✓ 6 arquivos de código principal
✓ 2 scripts de utilidade
✓ 4 exemplos de teste + README
✓ 5 arquivos de documentação
Total: 18 arquivos
```

### ✅ Build Testado
```bash
✓ Compilação bem-sucedida
✓ Sem erros TypeScript
✓ Sem erros de importação
✓ Todas as rotas funcionando
```

## 🚀 Como Começar

### 1. Iniciar o Servidor
```bash
npm run dev
```

Aguarde a mensagem:
```
✓ Ready in Xms
○ Local:   http://localhost:3000
```

### 2. Acessar a Interface ERP
Abra seu navegador em:
```
http://localhost:3000/erp
```

### 3. Testar o Sistema

#### Opção A: Usar Interface Web
1. Acesse `http://localhost:3000/erp`
2. Clique ou arraste um arquivo PDF
3. Clique em "Processar PDF"
4. Visualize os resultados
5. Baixe em CSV ou JSON

#### Opção B: Usar CLI
```bash
# Processar um PDF
npm run process-pdf seu-arquivo.pdf

# Com mais opções
npm run process-pdf seu-arquivo.pdf -- --output both --verbose
```

## 📊 Dados de Teste

### Gerar Exemplos (se ainda não gerou)
```bash
npx tsx scripts/test-data-generator.ts
```

Isso cria 4 arquivos em `test-data/`:
- `exemplo_tabular.txt`
- `exemplo_form.txt`
- `exemplo_mixed.txt`
- `exemplo_complex.txt`

### Converter para PDF
Converta os arquivos `.txt` para `.pdf` usando:
- **Online**: https://txt2pdf.com
- **Windows**: Abrir no Notepad > Imprimir > Microsoft Print to PDF
- **Linux**: `enscript exemplo.txt -p - | ps2pdf - exemplo.pdf`
- **Mac**: Abrir no TextEdit > Arquivo > Exportar como PDF

### Testar com Exemplos
```bash
npm run process-pdf test-data/exemplo_tabular.pdf -- --verbose
```

## 📁 Estrutura do Projeto

```
tnm-web/
├── app/
│   ├── api/process-pdf/
│   │   └── route.ts          ← API endpoint
│   └── erp/
│       └── page.tsx          ← Página principal
│
├── components/
│   └── PDFProcessor.tsx       ← Interface React
│
├── lib/
│   └── pdfProcessor.ts        ← Motor de processamento
│
├── types/
│   └── pdf-processor.ts       ← Definições TypeScript
│
├── scripts/
│   ├── process-pdf-cli.ts     ← Script CLI
│   └── test-data-generator.ts ← Gerador de exemplos
│
├── test-data/                 ← Exemplos de teste
│   ├── README.md
│   ├── exemplo_tabular.txt
│   ├── exemplo_form.txt
│   ├── exemplo_mixed.txt
│   └── exemplo_complex.txt
│
├── output/                    ← Saída dos processamentos (criado automaticamente)
│
└── [documentação]/
    ├── ERP_INSTALLATION.md    ← Este arquivo
    ├── ERP_OVERVIEW.md        ← Visão geral
    ├── ERP_README.md          ← Documentação técnica
    ├── ERP_QUICKSTART.md      ← Guia rápido
    ├── ERP_USE_CASES.md       ← Casos de uso
    └── ERP_SUMMARY.md         ← Resumo executivo
```

## 🔧 Configurações

### Limites e Ajustes

#### Tamanho Máximo de Upload
Arquivo: `app/api/process-pdf/route.ts`
```typescript
const maxSize = 10 * 1024 * 1024; // 10MB (ajuste aqui)
```

#### Timeout do CLI
Arquivo: `scripts/process-pdf-cli.ts`
```typescript
// Não há timeout por padrão, mas pode adicionar se necessário
```

#### Diretório de Saída Padrão
Arquivo: `scripts/process-pdf-cli.ts`
```typescript
saveDirectory: './output',  // Altere aqui
```

## 🌐 Variáveis de Ambiente

O sistema não requer variáveis de ambiente por padrão, mas você pode configurar se necessário:

```bash
# .env.local (criar se necessário)

# Tamanho máximo de upload (bytes)
MAX_FILE_SIZE=10485760

# Diretório de saída
OUTPUT_DIR=./output

# Modo de debug
DEBUG=true
```

## 🔒 Segurança (Produção)

### ⚠️ Antes de Deploy em Produção

1. **Adicionar Autenticação**
```typescript
// app/api/process-pdf/route.ts
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  // ... resto do código
}
```

2. **Rate Limiting**
```bash
npm install @upstash/ratelimit @upstash/redis
```

3. **CORS**
```typescript
// next.config.ts
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'seu-dominio.com' },
    ],
  }];
}
```

4. **Validação Adicional**
```typescript
// Validar conteúdo do PDF
// Sanitizar dados sensíveis
// Log de auditoria
```

## 🧪 Testes

### Testar Manualmente

1. **Interface Web**
```bash
npm run dev
# Acessar http://localhost:3000/erp
# Upload de um PDF
# Verificar visualização
# Testar download CSV/JSON
```

2. **CLI**
```bash
# Teste básico
npm run process-pdf test-data/exemplo_tabular.pdf

# Teste com todas as opções
npm run process-pdf test-data/exemplo_complex.pdf -- --output both --save ./teste --verbose
```

3. **API REST**
```bash
# Usando curl
curl -X POST http://localhost:3000/api/process-pdf \
  -F "file=@documento.pdf"

# Usando Postman
POST http://localhost:3000/api/process-pdf
Body: form-data
  file: [selecionar PDF]
```

### Adicionar Testes Automatizados (opcional)

```bash
# Instalar dependências de teste
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Criar teste
# __tests__/pdfProcessor.test.ts
```

## 📊 Monitoramento

### Logs de Desenvolvimento
```bash
# Terminal onde rodou npm run dev
# Logs aparecem automaticamente
```

### Logs de Produção
```bash
# Adicionar logging estruturado
npm install winston

# Configurar em lib/logger.ts
```

## 🐛 Solução de Problemas

### Problema: "Module not found: pdf-parse"
```bash
# Solução: Reinstalar dependências
npm install
```

### Problema: "Port 3000 is already in use"
```bash
# Solução: Usar porta diferente
npm run dev -- -p 3001
```

### Problema: "Build failed"
```bash
# Solução: Limpar cache e rebuildar
rm -rf .next node_modules
npm install
npm run build
```

### Problema: CLI não funciona
```bash
# Solução: Verificar permissões
chmod +x scripts/process-pdf-cli.ts

# Ou usar diretamente
npx tsx scripts/process-pdf-cli.ts arquivo.pdf
```

### Problema: PDF não processa corretamente
```bash
# Verificar se é PDF escaneado (não suportado)
# Testar com os exemplos fornecidos
# Usar modo verbose para debug
npm run process-pdf arquivo.pdf -- --verbose
```

## 📱 Acesso Mobile

A interface web é responsiva e funciona em dispositivos móveis:
```
http://localhost:3000/erp
```

## 🔄 Atualizações

### Atualizar Dependências
```bash
# Ver versões desatualizadas
npm outdated

# Atualizar
npm update

# Ou atualizar específica
npm install pdf-parse@latest
```

### Atualizar Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

## 💾 Backup

### Arquivos Importantes para Backup
```
lib/pdfProcessor.ts           # Lógica principal
app/api/process-pdf/route.ts  # API
components/PDFProcessor.tsx    # Interface
types/pdf-processor.ts         # Tipos
scripts/                       # Scripts utilitários
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Outras Plataformas
- **Netlify**: Conectar repositório Git
- **Railway**: Deploy direto do GitHub
- **AWS**: Usar AWS Amplify
- **Docker**: Criar Dockerfile customizado

## 📚 Próximos Passos

1. ✅ Sistema instalado e funcionando
2. 📖 Ler [ERP_QUICKSTART.md](./ERP_QUICKSTART.md)
3. 🧪 Testar com seus PDFs
4. 🎨 Customizar conforme necessário
5. 🚀 Deploy em produção (quando pronto)

## 🆘 Suporte

### Documentação
- **Início Rápido**: ERP_QUICKSTART.md
- **Visão Geral**: ERP_OVERVIEW.md
- **Técnica**: ERP_README.md
- **Casos de Uso**: ERP_USE_CASES.md
- **Resumo**: ERP_SUMMARY.md

### Debug
```bash
# CLI com verbose
npm run process-pdf arquivo.pdf -- --verbose

# Web (console do navegador)
F12 > Console
```

---

## ✅ Checklist de Instalação

- [x] Dependências instaladas
- [x] Arquivos criados
- [x] Build testado
- [x] Exemplos gerados
- [x] Documentação criada
- [x] Sistema funcionando

**Tudo pronto! Sistema 100% operacional.** 🎉

---

*Última atualização: Julho 2026*
*Versão: 1.0.0*
