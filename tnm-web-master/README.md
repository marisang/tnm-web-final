# 🎭 Tona Mídia - Sistema ERP

Sistema de gestão integrado para shows e eventos, desenvolvido com Next.js e Supabase.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **Supabase** - Banco de dados e autenticação
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **PDF Parse** - Processamento de PDFs
- **XLSX** - Processamento de planilhas

## 📋 Funcionalidades

### ✅ Sistema ERP (`/erp`)
- **Gestão de Clientes**: CRUD completo com informações detalhadas
- **Gestão de Shows**: Controle de eventos, artistas e datas
- **Gestão de Produtos**: Controle de estoque e fornecedores
- **Painel Financeiro**: Receitas, despesas e saldo

### 📄 Processamento de Documentos
- Importação de PDFs
- Processamento de planilhas Excel
- Análise e extração de dados

### 👥 Sistema de Usuários
- Autenticação
- Controle de acesso
- 2FA (Two-Factor Authentication)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd tnm-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie o arquivo .env.local
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:3000
```

## 📊 Configuração do Supabase

Veja o guia completo de configuração em [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)

### Resumo rápido:
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL fornecido (veja a imagem do diagrama)
3. Configure as variáveis de ambiente
4. Execute o projeto

## 🗂️ Estrutura do Projeto

```
tnm-web/
├── app/                      # Páginas Next.js (App Router)
│   ├── admin/               # Área administrativa
│   ├── erp/                 # Sistema ERP
│   ├── login/               # Autenticação
│   └── api/                 # API routes
├── components/              # Componentes React
│   ├── admin/              # Componentes admin
│   └── erp/                # Componentes ERP
│       ├── Dashboard.tsx    # Dashboard principal
│       ├── ClientesList.tsx # Gestão de clientes
│       ├── ShowsList.tsx    # Gestão de shows
│       ├── ProdutosList.tsx # Gestão de produtos
│       └── FinanceiroPanel.tsx # Painel financeiro
├── lib/                     # Bibliotecas e utilitários
│   ├── supabase.ts         # Configuração Supabase
│   ├── supabaseClient.ts   # Funções de banco de dados
│   ├── pdfProcessor.ts     # Processamento de PDF
│   └── mockData.ts         # Dados de teste
├── types/                   # Definições TypeScript
├── scripts/                 # Scripts de utilidade
└── public/                  # Arquivos estáticos
```

## 📱 Módulos Disponíveis

### 🎭 Shows e Eventos
- Cadastro de artistas
- Agendamento de shows
- Sinopse e rider técnico
- Galeria de fotos

### 👤 Clientes e Fornecedores
- Cadastro completo
- Histórico de transações
- Controle de documentos

### 📦 Produtos e Estoque
- Categorização
- Controle de estoque
- Gestão de compras e vendas

### 💰 Financeiro
- Receitas e despesas
- Cálculos de percentuais
- Relatórios financeiros

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run process-pdf  # Processar PDF via CLI
```

## 📖 Documentação Adicional

- [Configuração do Supabase](./SUPABASE_CONFIG.md)
- [Setup Admin](./ADMIN_SETUP.md)
- [Documentação ERP](./ERP_README.md)
- [Guia Rápido ERP](./ERP_QUICKSTART.md)

## 🔐 Segurança

- Autenticação via Supabase
- Row Level Security (RLS) no banco de dados
- Variáveis de ambiente protegidas
- Validação de dados no cliente e servidor

## 🚧 Próximas Funcionalidades

- [ ] Autenticação completa com Supabase Auth
- [ ] Upload de imagens com Supabase Storage
- [ ] Relatórios e gráficos
- [ ] Exportação de dados (PDF/Excel)
- [ ] Notificações em tempo real
- [ ] API REST completa
- [ ] Aplicativo mobile (React Native)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📄 Licença

Este projeto é proprietário da Tona Mídia.

## 📧 Contato

Para mais informações, entre em contato com a equipe Tona Mídia.
