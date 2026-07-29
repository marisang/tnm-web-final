# 🚀 Guia de Instalação - TNM Web

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- Conta no **Supabase** - [Criar conta](https://supabase.com)

---

## 📦 Passo 1: Instalar Dependências

No terminal, navegue até a pasta do projeto e execute:

```bash
npm install
```

ou se preferir usar yarn:

```bash
yarn install
```

Isso irá instalar todas as dependências listadas no `package.json`:
- Next.js 16
- React 19
- Supabase JS Client
- Tailwind CSS 4
- TypeScript
- PDF Parse
- XLSX (para planilhas)

---

## 🗄️ Passo 2: Configurar o Supabase

### 2.1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Escolha um nome, senha e região
5. Aguarde a criação do projeto (1-2 minutos)

### 2.2. Criar as Tabelas

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **"Run"** para executar o SQL
5. Verifique se as 20 tabelas foram criadas em **Table Editor**

### 2.3. Obter Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (URL)
   - **anon public** (Key)

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Windows (PowerShell)
New-Item .env.local -ItemType File

# Windows (CMD)
type nul > .env.local

# Linux/Mac
touch .env.local
```

### 3.2. Adicionar Variáveis

Abra o arquivo `.env.local` e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

⚠️ **IMPORTANTE:**
- Substitua os valores pelos dados do seu projeto Supabase
- Nunca commite este arquivo no Git (já está no `.gitignore`)
- As variáveis DEVEM começar com `NEXT_PUBLIC_` para serem acessíveis no cliente

---

## 🚀 Passo 4: Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

### Build de Produção

```bash
npm run build
npm run start
```

---

## ✅ Passo 5: Testar a Instalação

### 5.1. Acessar a Aplicação

Abra o navegador e acesse: **http://localhost:3000**

Você deverá ver a tela splash com o logo TNM.

### 5.2. Testar a Conexão com Supabase

1. Clique na tela inicial (vai para `/admin/login`)
2. No menu superior direito (☰), clique em **"Teste Supabase"**
3. A página executará testes automáticos
4. Verifique se todos os testes passaram ✅

**Resultados Esperados:**
- ✅ Variáveis de Ambiente: Configuradas corretamente
- ✅ Conexão Supabase: Conectado com sucesso
- ✅ Tabelas: 20/20 tabelas OK

Se houver erros ❌, verifique:
- As variáveis de ambiente estão corretas?
- As tabelas foram criadas no Supabase?
- Há algum bloqueio de rede ou firewall?

---

## 🗺️ Passo 6: Explorar as Páginas

### Páginas Disponíveis:

1. **Splash** (`/`)
   - Tela inicial com logo
   - Clique para ir ao login

2. **Login Admin** (`/admin/login`)
   - Tela de login administrativo
   - (Autenticação ainda não implementada)

3. **2FA Admin** (`/admin/2fa`)
   - Tela de autenticação de dois fatores
   - 6 campos para código

4. **Admin Principal** (`/admin`)
   - Seção de moderação de shows
   - Criação de novos shows

5. **Dashboard** (`/admin/dashboard`)
   - Métricas financeiras
   - Upload de relatórios (ONErpm, ECAD, ABRAMUS)

6. **Conciliação e Splits** (`/admin/conciliacao`)
   - Tabela de transações
   - Cálculo de splits TNM/Artistas
   - Status de pagamentos

7. **Gestão de Artistas** (`/admin/artistas`)
   - Lista de artistas cadastrados
   - Contratos e percentuais
   - Modal com detalhes completos

8. **ERP** (`/erp`)
   - Sistema ERP completo
   - Gestão de clientes, produtos, shows
   - Painel financeiro

9. **Teste Supabase** (`/admin/test-connection`)
   - Diagnóstico de conexão
   - Verificação de tabelas
   - Troubleshooting

---

## 🔧 Troubleshooting

### Erro: "next: command not found"

**Solução:** Execute `npm install` novamente

### Erro: "supabaseUrl is required"

**Solução:** Verifique se o arquivo `.env.local` está na raiz do projeto com as variáveis corretas

### Erro: Tabelas não encontradas

**Solução:**
1. Vá no Supabase → SQL Editor
2. Execute o arquivo `supabase-schema.sql`
3. Verifique no Table Editor se as tabelas foram criadas

### Erro: CORS ou Network Error

**Solução:**
1. Verifique se a URL do Supabase está correta
2. Certifique-se de que o projeto Supabase está ativo
3. Verifique se não há bloqueio de firewall

### Erro: Port 3000 já está em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Documentação Adicional

- `MUDANCAS_REALIZADAS.md` - Lista de todas as mudanças recentes
- `README.md` - Visão geral do projeto
- `SUPABASE_CONFIG.md` - Configuração detalhada do Supabase
- `ERP_README.md` - Documentação do módulo ERP

---

## 🆘 Suporte

Se encontrar problemas:

1. Consulte a documentação acima
2. Verifique os logs no terminal
3. Acesse a página de teste: `/admin/test-connection`
4. Confira o console do navegador (F12)

---

## ✨ Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Explorar todas as páginas
2. ✅ Testar o menu de navegação
3. ✅ Verificar a conexão com Supabase
4. 🔄 Implementar autenticação real
5. 🔄 Conectar dados mockados ao Supabase
6. 🔄 Implementar upload de relatórios
7. 🔄 Adicionar validações e feedback

---

**Desenvolvido para Tô na Mídia (TNM)**  
*Sistema de Gestão de Shows e Eventos*
