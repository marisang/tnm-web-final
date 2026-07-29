# 🗄️ Guia: Criar Tabelas no Supabase

## 📋 Status Atual da Conexão

✅ **Conexão com Supabase:** Funcionando  
✅ **Tabela "usuarios":** Criada  
❌ **Outras tabelas:** Faltando (9 de 10 testadas)

---

## 🚀 Passo a Passo para Criar as Tabelas

### 1️⃣ Acessar o Supabase

1. Abra seu navegador
2. Acesse: https://supabase.com
3. Faça login na sua conta
4. Selecione o projeto: **lmiegovyvqlarqjntquc**

---

### 2️⃣ Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone <>)
2. Clique no botão **"New query"** (ou "+ New query")

---

### 3️⃣ Copiar e Colar o SQL

1. Abra o arquivo `supabase-schema.sql` na raiz do projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no editor SQL do Supabase

---

### 4️⃣ Executar o SQL

1. Clique no botão **"Run"** (ou pressione Ctrl+Enter / Cmd+Enter)
2. Aguarde alguns segundos
3. Você verá uma mensagem de sucesso: ✅ "Success. No rows returned"

---

### 5️⃣ Verificar se as Tabelas Foram Criadas

1. No menu lateral, clique em **"Table Editor"** (ícone de tabela)
2. Você deverá ver **20 tabelas** criadas:

**Tabelas Principais:**
- ✅ usuarios
- ✅ clientes
- ✅ fornecedores
- ✅ categorias
- ✅ produtos

**Tabelas de Transações:**
- ✅ vendas
- ✅ itens_venda
- ✅ compras
- ✅ itens_compra

**Tabelas de Shows:**
- ✅ artistas
- ✅ data_shows
- ✅ sinopse
- ✅ rider
- ✅ rider_tecnico
- ✅ fotografias

**Tabelas de Sistema:**
- ✅ importacoes
- ✅ dados_importacao
- ✅ receitas_despesas
- ✅ percentual_unit
- ✅ valor_revisao

---

### 6️⃣ Verificar a Conexão

Após criar as tabelas, execute o teste novamente:

```bash
node test-supabase-connection.js
```

**Resultado Esperado:**
```
✅ Tabelas OK: 10/10
🎉 SUCESSO! Supabase está funcionando perfeitamente!
```

Ou teste pelo navegador:
```
npm run dev
# Acesse: http://localhost:3000/admin/test-connection
```

---

## 🔧 Troubleshooting

### Erro: "permission denied"

**Solução:** Desabilite RLS temporariamente
1. No Table Editor, clique em uma tabela
2. Clique em **"RLS disabled"** ou desabilite o Row Level Security
3. Execute o SQL novamente

### Erro: "already exists"

**Solução:** Isso é normal! Significa que a tabela já existe
- O SQL usa `CREATE TABLE IF NOT EXISTS`, então não há problema

### Algumas tabelas não aparecem

**Solução:**
1. Verifique se todo o SQL foi executado (role até o final do script)
2. Tente executar novamente
3. Verifique o console de erros no Supabase

---

## 📊 Dados Iniciais

O SQL já inclui alguns dados iniciais:

**Categorias Padrão:**
- Equipamentos
- Alimentação
- Hospedagem
- Transporte

**Usuário Admin:**
- Email: admin@tonamidia.com
- Senha: ALTERAR_SENHA (⚠️ MUDE ISSO!)

---

## 🎯 Próximos Passos

Após criar as tabelas:

1. ✅ Execute o teste de conexão
2. ✅ Acesse `/admin/test-connection` no navegador
3. ✅ Verifique se todos os testes passam
4. ✅ Comece a usar o sistema!

---

## 📝 Comandos Úteis

### Testar conexão via terminal:
```bash
node test-supabase-connection.js
```

### Rodar o projeto:
```bash
npm run dev
```

### Acessar teste no navegador:
```
http://localhost:3000/admin/test-connection
```

---

## 💡 Dica Importante

Se você já executou o SQL antes e quer refazer tudo do zero:

1. No SQL Editor, execute:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

2. Execute novamente o conteúdo de `supabase-schema.sql`

⚠️ **ATENÇÃO:** Isso apaga TODOS os dados!

---

**Precisa de ajuda?** Execute o teste e veja o resultado!
