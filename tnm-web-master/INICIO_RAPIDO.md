# 🚀 Guia de Início Rápido - Tona Mídia ERP

## ⚡ Setup em 5 Minutos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Supabase

#### A. Criar Projeto no Supabase
1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação (1-2 minutos)

#### B. Executar o SQL
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. ✅ Todas as tabelas serão criadas!

#### C. Obter Credenciais
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public key**

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
copy .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...sua-chave-aqui
```

### 4️⃣ Iniciar o Projeto

```bash
npm run dev
```

### 5️⃣ Acessar o Sistema

Abra no navegador:
- **Homepage**: http://localhost:3000
- **Sistema ERP**: http://localhost:3000/erp
- **Admin**: http://localhost:3000/admin

---

## 🎯 Primeiros Passos no ERP

### Cadastrar um Cliente
1. Acesse `/erp`
2. Clique na aba "Clientes"
3. Clique em "Novo Cliente"
4. Preencha os dados
5. Clique em "Salvar"

### Cadastrar um Artista
Primeiro, cadastre um artista no Supabase:

```sql
INSERT INTO artistas (nome, biografia, genero_musical, contato) 
VALUES ('Nome do Artista', 'Biografia...', 'Rock', 'contato@email.com');
```

### Criar um Show
1. Acesse `/erp`
2. Clique na aba "Shows"
3. Clique em "Novo Show"
4. Preencha os dados
5. Selecione o artista
6. Clique em "Salvar"

### Adicionar Produtos
1. Primeiro, crie categorias no Supabase (já foram criadas algumas padrão)
2. Acesse a aba "Produtos"
3. Clique em "Novo Produto"
4. Preencha os dados
5. Clique em "Salvar"

### Controlar Financeiro
1. Acesse a aba "Financeiro"
2. Clique em "Novo Lançamento"
3. Escolha "Receita" ou "Despesa"
4. Preencha os dados
5. Clique em "Salvar"
6. Veja o resumo atualizado nos cards

---

## 📊 Estrutura dos Módulos

### 🎭 Shows
- Cadastro de artistas
- Agendamento de shows
- Sinopse e informações
- Rider técnico
- Galeria de fotos

### 👥 Clientes
- Cadastro completo
- CPF/CNPJ
- Endereço completo
- Histórico de vendas

### 📦 Produtos
- Categorização
- Controle de estoque
- Preço e fornecedores
- Compras e vendas

### 💰 Financeiro
- Receitas
- Despesas
- Saldo automático
- Categorização

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Verificar erros
npm run lint

# Processar PDF
npm run process-pdf
```

---

## 🎨 Interface

O sistema possui uma interface moderna e intuitiva:

- **Dashboard com abas**: Navegação fácil entre módulos
- **Formulários inline**: Criar/editar sem sair da página
- **Tabelas responsivas**: Visualização clara dos dados
- **Cards de resumo**: Indicadores financeiros
- **Design moderno**: Gradientes e cores vibrantes

---

## 📝 Próximos Passos

1. **Explorar o sistema**: Navegue pelas abas e funcionalidades
2. **Personalizar**: Ajuste cores e estilos em `tailwind.config`
3. **Adicionar dados**: Cadastre seus clientes, shows e produtos
4. **Implementar auth**: Configure Supabase Auth para login
5. **Upload de imagens**: Use Supabase Storage para fotos

---

## 🆘 Precisa de Ajuda?

### Erros Comuns

**Erro: "Invalid API key"**
- Verifique o arquivo `.env.local`
- Reinicie o servidor (`npm run dev`)

**Erro: "Table does not exist"**
- Execute o SQL novamente no Supabase
- Verifique os nomes das tabelas

**Página em branco**
- Abra o console do navegador (F12)
- Verifique se há erros de JavaScript

### Documentação

- [Configuração Completa](./SUPABASE_CONFIG.md)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)

---

## ✅ Checklist

- [ ] Projeto Supabase criado
- [ ] SQL executado com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor de desenvolvimento rodando
- [ ] Sistema acessível no navegador
- [ ] Primeiro cliente cadastrado
- [ ] Primeiro show criado
- [ ] Controle financeiro funcionando

---

🎉 **Parabéns! Seu sistema ERP está pronto para uso!**
