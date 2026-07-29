// Script de teste da conexão Supabase
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente manualmente do .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    process.env[key] = value;
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // Teste 1: Verificar conexão
    console.log('1️⃣ Verificando credenciais...');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error('❌ Credenciais não encontradas!');
      return;
    }
    console.log('✅ Credenciais configuradas');
    console.log('   URL:', url);
    console.log('   Key:', key.substring(0, 20) + '...\n');

    // Teste 2: Listar tabelas (via query simples)
    console.log('2️⃣ Testando query no banco de dados...');
    
    // Tenta buscar categorias
    const { data: categorias, error: errorCat } = await supabase
      .from('categorias')
      .select('*')
      .limit(5);

    if (errorCat) {
      console.error('❌ Erro ao buscar categorias:', errorCat.message);
      console.log('   Possível causa: Tabelas não foram criadas no Supabase');
      console.log('   Solução: Execute o arquivo supabase-schema.sql no Supabase SQL Editor\n');
    } else {
      console.log('✅ Query executada com sucesso!');
      console.log(`   Categorias encontradas: ${categorias?.length || 0}\n`);
      if (categorias && categorias.length > 0) {
        console.log('   Exemplos:');
        categorias.forEach((cat: any) => {
          console.log(`   - ${cat.nome}`);
        });
      }
    }

    // Teste 3: Buscar clientes
    console.log('\n3️⃣ Testando tabela de clientes...');
    const { data: clientes, error: errorCli } = await supabase
      .from('clientes')
      .select('*')
      .limit(5);

    if (errorCli) {
      console.error('❌ Erro ao buscar clientes:', errorCli.message);
    } else {
      console.log('✅ Tabela de clientes acessível!');
      console.log(`   Clientes encontrados: ${clientes?.length || 0}\n`);
    }

    // Teste 4: Buscar artistas
    console.log('4️⃣ Testando tabela de artistas...');
    const { data: artistas, error: errorArt } = await supabase
      .from('artistas')
      .select('*')
      .limit(5);

    if (errorArt) {
      console.error('❌ Erro ao buscar artistas:', errorArt.message);
    } else {
      console.log('✅ Tabela de artistas acessível!');
      console.log(`   Artistas encontrados: ${artistas?.length || 0}\n`);
    }

    console.log('\n✨ Teste concluído!');
    console.log('\n📝 Resumo:');
    console.log('   - Credenciais: OK');
    console.log('   - Conexão: OK');
    console.log(`   - Tabelas: ${!errorCat && !errorCli && !errorArt ? 'OK' : 'Verifique SQL'}`);

    if (!errorCat && !errorCli && !errorArt) {
      console.log('\n🎉 Sistema 100% funcional!');
      console.log('   Acesse: http://localhost:3000/erp');
    } else {
      console.log('\n⚠️  Execute o SQL no Supabase:');
      console.log('   1. Abra https://app.supabase.com/project/lmiegovyvqlarqjntquc/sql');
      console.log('   2. Cole o conteúdo de supabase-schema.sql');
      console.log('   3. Execute o SQL');
    }

  } catch (error) {
    console.error('\n❌ Erro ao testar:', error);
  }
}

testConnection();
