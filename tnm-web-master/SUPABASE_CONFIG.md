# Configuração do Supabase

Este documento explica como configurar e integrar o Supabase ao projeto.

## 🚀 Passo 1: Obter Credenciais do Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL**: URL do seu projeto
   - **anon/public key**: Chave pública (anon key)

## 🔧 Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` na raiz do projeto e adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

⚠️ **Importante**: Não commite o arquivo `.env.local` no Git!

## 📊 Passo 3: Estrutura do Banco de Dados

O banco de dados já foi criado com as seguintes tabelas principais:

### Módulo de Shows e Eventos
- **artistas**: Informações dos artistas
- **data_shows**: Datas e locais dos shows
- **sinopse**: Sinopses dos shows
- **rider**: Requisitos de rider
- **rider_tecnico**: Requisitos técnicos
- **fotografias**: Fotos dos eventos

### Módulo de Clientes e Fornecedores
- **clientes**: Cadastro de clientes
- **fornecedores**: Cadastro de fornecedores

### Módulo de Produtos e Estoque
- **categorias**: Categorias de produtos
- **produtos**: Cadastro de produtos
- **compras**: Registro de compras
- **itens_compra**: Itens das compras
- **vendas**: Registro de vendas
- **itens_venda**: Itens das vendas

### Módulo Financeiro
- **receitas_despesas**: Controle financeiro
- **percentual_unit**: Cálculos de percentuais
- **valor_revisao**: Revisões de valores

### Módulo de Importação
- **importacoes**: Histórico de importações
- **dados_importacao**: Dados importados

### Sistema
- **usuarios**: Usuários do sistema

## 🎯 Passo 4: Funcionalidades Implementadas

### Dashboard ERP (`/erp`)
- **Clientes**: CRUD completo de clientes
- **Shows**: Gestão de shows e eventos
- **Produtos**: Controle de estoque
- **Financeiro**: Controle de receitas e despesas

### Componentes Criados

1. **Dashboard.tsx**: Painel principal com navegação por abas
2. **ClientesList.tsx**: Gestão de clientes
3. **ShowsList.tsx**: Gestão de shows
4. **ProdutosList.tsx**: Gestão de produtos
5. **FinanceiroPanel.tsx**: Painel financeiro com resumo

### Bibliotecas de Cliente Supabase

- **lib/supabase.ts**: Configuração e tipos do Supabase
- **lib/supabaseClient.ts**: Funções de acesso ao banco de dados

## 🔥 Passo 5: Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000/erp

## 📝 Exemplos de Uso

### Criar um Cliente

```typescript
import { createCliente } from '@/lib/supabaseClient';

const novoCliente = await createCliente({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '11999999999',
  cpf_cnpj: '123.456.789-00'
});
```

### Listar Shows

```typescript
import { getShows } from '@/lib/supabaseClient';

const shows = await getShows();
// Retorna shows com dados de artistas, sinopse, rider, etc.
```

### Adicionar Receita/Despesa

```typescript
import { createReceitaDespesa } from '@/lib/supabaseClient';

await createReceitaDespesa({
  tipo: 'receita',
  descricao: 'Venda de ingressos',
  valor: 5000.00,
  data: '2024-01-15',
  categoria: 'Shows'
});
```

## 🔐 Segurança

### Row Level Security (RLS)

Configure políticas RLS no Supabase para controlar o acesso aos dados:

1. Acesse **Authentication** → **Policies**
2. Crie políticas para cada tabela conforme necessário

Exemplo de política básica:

```sql
-- Permitir leitura para usuários autenticados
CREATE POLICY "Enable read for authenticated users"
ON clientes FOR SELECT
USING (auth.role() = 'authenticated');

-- Permitir inserção para usuários autenticados
CREATE POLICY "Enable insert for authenticated users"
ON clientes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

## 🎨 Próximos Passos

1. **Autenticação**: Implementar login com Supabase Auth
2. **Upload de Imagens**: Usar Supabase Storage para fotografias
3. **Relatórios**: Criar dashboards com gráficos
4. **Filtros**: Adicionar busca e filtros nas listagens
5. **Exportação**: Permitir exportar dados em PDF/Excel

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🐛 Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Table does not exist"
- Verifique se as tabelas foram criadas no Supabase
- Confira os nomes das tabelas no SQL Editor

### Erro de CORS
- Verifique as configurações de CORS no Supabase Dashboard
- Adicione `localhost:3000` aos domínios permitidos
