// Script para listar TODAS as tabelas existentes no Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Listando TODAS as tabelas no Supabase...\n');
console.log('━'.repeat(60));

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ ERRO: Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listarTodasTabelas() {
  try {
    // Query SQL direto no PostgreSQL para listar todas as tabelas
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });

    if (error) {
      console.log('⚠️  Método RPC não disponível. Tentando método alternativo...\n');
      
      // Método alternativo: verificar tabelas conhecidas
      const tabelasEsperadas = [
        'usuarios', 'clientes', 'fornecedores', 'categorias', 'produtos',
        'vendas', 'itens_venda', 'compras', 'itens_compra',
        'artistas', 'data_shows', 'sinopse', 'rider', 'rider_tecnico',
        'fotografias', 'importacoes', 'dados_importacao',
        'receitas_despesas', 'percentual_unit', 'valor_revisao'
      ];

      console.log('📋 Verificando tabelas esperadas:\n');
      
      let encontradas = 0;
      let naoEncontradas = 0;

      for (const tabela of tabelasEsperadas) {
        try {
          const { count, error: testError } = await supabase
            .from(tabela)
            .select('*', { count: 'exact', head: true });

          if (testError) {
            console.log(`   ❌ ${tabela.padEnd(25)} - NÃO EXISTE`);
            console.log(`      Erro: ${testError.message}`);
            naoEncontradas++;
          } else {
            console.log(`   ✅ ${tabela.padEnd(25)} - ${count || 0} registros`);
            encontradas++;
          }
        } catch (err) {
          console.log(`   ❌ ${tabela.padEnd(25)} - ERRO: ${err.message}`);
          naoEncontradas++;
        }
      }

      console.log('\n━'.repeat(60));
      console.log('📊 RESUMO:\n');
      console.log(`   Total esperado: ${tabelasEsperadas.length} tabelas`);
      console.log(`   ✅ Encontradas: ${encontradas}`);
      console.log(`   ❌ Não encontradas: ${naoEncontradas}`);
      
      const percentual = ((encontradas / tabelasEsperadas.length) * 100).toFixed(1);
      console.log(`   📈 Progresso: ${percentual}%`);
      
      if (encontradas === tabelasEsperadas.length) {
        console.log('\n🎉 PERFEITO! Todas as tabelas estão criadas!');
      } else if (encontradas > 0) {
        console.log(`\n⚠️  ATENÇÃO: ${naoEncontradas} tabela(s) faltando!`);
        console.log('   Execute o arquivo supabase-schema.sql no Supabase');
      } else {
        console.log('\n❌ ERRO: Nenhuma tabela encontrada!');
        console.log('   Execute o arquivo supabase-schema.sql no Supabase');
      }
      
      console.log('━'.repeat(60));
      console.log('\n');
      
    } else {
      console.log('✅ Tabelas encontradas:\n');
      data.forEach((row, index) => {
        console.log(`   ${(index + 1).toString().padStart(2)}. ${row.table_name}`);
      });
      console.log(`\n📊 Total: ${data.length} tabelas`);
      console.log('━'.repeat(60));
    }
    
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
  }
}

listarTodasTabelas();
