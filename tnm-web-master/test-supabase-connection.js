// Script para testar conexão com Supabase
const { createClient } = require('@supabase/supabase-js');

// Carregar variáveis de ambiente do .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Testando Conexão com Supabase...\n');
console.log('━'.repeat(60));

// Verificar variáveis de ambiente
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ ERRO: Variáveis de ambiente não encontradas!');
  console.log('   Verifique o arquivo .env.local\n');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente encontradas');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);
console.log('━'.repeat(60));

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para testar conexão
async function testConnection() {
  console.log('\n🧪 Executando testes...\n');

  // Teste 1: Conectividade básica
  try {
    console.log('1️⃣  Teste de conectividade básica...');
    const { data, error } = await supabase
      .from('clientes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   💡 A tabela "clientes" não existe. Execute o SQL schema!');
      }
    } else {
      console.log('   ✅ Conexão estabelecida com sucesso!');
    }
  } catch (err) {
    console.log(`   ❌ Erro na conexão: ${err.message}`);
  }

  // Teste 2: Verificar tabelas principais
  console.log('\n2️⃣  Verificando todas as tabelas...');
  const tabelas = [
    // Tabelas principais
    'usuarios', 'clientes', 'fornecedores', 'categorias', 'produtos',
    // Transações
    'vendas', 'itens_venda', 'compras', 'itens_compra',
    // Shows e Artistas
    'artistas', 'data_shows', 'sinopse', 'rider', 'rider_tecnico', 'fotografias',
    // Sistema e Financeiro
    'importacoes', 'dados_importacao', 'receitas_despesas', 
    'percentual_unit', 'valor_revisao'
  ];

  let tabelasOk = 0;
  let tabelasErro = 0;

  for (const tabela of tabelas) {
    try {
      const { error } = await supabase
        .from(tabela)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${tabela}: ${error.message}`);
        tabelasErro++;
      } else {
        console.log(`   ✅ ${tabela}: OK`);
        tabelasOk++;
      }
    } catch (err) {
      console.log(`   ❌ ${tabela}: ${err.message}`);
      tabelasErro++;
    }
  }

  // Teste 3: Inserir e deletar um registro de teste
  console.log('\n3️⃣  Teste de escrita/leitura...');
  try {
    const testCliente = {
      nome: 'Teste Connection',
      email: 'teste@test.com',
      telefone: '11999999999'
    };

    // Inserir
    const { data: insertData, error: insertError } = await supabase
      .from('clientes')
      .insert([testCliente])
      .select();

    if (insertError) {
      console.log(`   ❌ Erro ao inserir: ${insertError.message}`);
    } else {
      console.log('   ✅ Inserção bem-sucedida');

      // Deletar
      const { error: deleteError } = await supabase
        .from('clientes')
        .delete()
        .eq('email', 'teste@test.com');

      if (deleteError) {
        console.log(`   ⚠️  Aviso: Não foi possível deletar o registro de teste`);
      } else {
        console.log('   ✅ Deleção bem-sucedida');
      }
    }
  } catch (err) {
    console.log(`   ❌ Erro no teste: ${err.message}`);
  }

  // Resumo
  console.log('\n━'.repeat(60));
  console.log('📊 RESUMO DOS TESTES\n');
  console.log(`   Total de tabelas testadas: ${tabelas.length}`);
  console.log(`   ✅ Tabelas OK: ${tabelasOk}`);
  console.log(`   ❌ Tabelas com erro: ${tabelasErro}`);
  
  if (tabelasErro === 0) {
    console.log('\n🎉 SUCESSO! Supabase está funcionando perfeitamente!');
  } else if (tabelasErro === tabelas.length) {
    console.log('\n⚠️  ATENÇÃO: Nenhuma tabela foi encontrada!');
    console.log('   Execute o arquivo supabase-schema.sql no SQL Editor do Supabase');
  } else {
    console.log('\n⚠️  ATENÇÃO: Algumas tabelas estão faltando!');
    console.log('   Verifique o SQL schema no Supabase');
  }
  
  console.log('━'.repeat(60));
  console.log('\n');
}

// Executar testes
testConnection();
