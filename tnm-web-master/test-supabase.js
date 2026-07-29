/**
 * Script de teste de conexão com os bancos Supabase
 * Testa ambos: banco WEB (admin) e banco APP (artistas)
 * 
 * Uso: node test-supabase.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  log('\n🔍 Testando conexões com Supabase...', 'cyan');
  log('='.repeat(60), 'cyan');

  // Teste 1: Banco WEB (Administrativo)
  log('\n📊 Banco WEB (Administrativo)', 'blue');
  log('-'.repeat(60), 'blue');
  
  const webUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const webKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!webUrl || !webKey) {
    log('❌ ERRO: Variáveis de ambiente do banco WEB não configuradas', 'red');
    log('   Necessário: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY', 'yellow');
  } else {
    log(`✓ URL: ${webUrl}`, 'green');
    log(`✓ Key: ${webKey.substring(0, 20)}...`, 'green');

    try {
      const supabaseWeb = createClient(webUrl, webKey);
      
      // Tenta uma query simples
      const { data, error } = await supabaseWeb
        .from('usuarios')
        .select('count', { count: 'exact', head: true });

      if (error) {
        log(`❌ Erro ao conectar: ${error.message}`, 'red');
        log(`   Código: ${error.code || 'N/A'}`, 'yellow');
      } else {
        log('✅ Conexão bem-sucedida!', 'green');
        log(`   Tabela 'usuarios' acessível`, 'green');
      }
    } catch (err) {
      log(`❌ Erro na conexão: ${err.message}`, 'red');
    }
  }

  // Teste 2: Banco APP (Artistas)
  log('\n🎵 Banco APP (Artistas)', 'blue');
  log('-'.repeat(60), 'blue');
  
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_APP_URL;
  const appKey = process.env.NEXT_PUBLIC_SUPABASE_APP_ANON_KEY;
  const appServiceKey = process.env.SUPABASE_APP_SERVICE_ROLE_KEY;

  if (!appUrl || !appKey) {
    log('❌ ERRO: Variáveis de ambiente do banco APP não configuradas', 'red');
    log('   Necessário: NEXT_PUBLIC_SUPABASE_APP_URL e NEXT_PUBLIC_SUPABASE_APP_ANON_KEY', 'yellow');
  } else {
    log(`✓ URL: ${appUrl}`, 'green');
    log(`✓ Anon Key: ${appKey.substring(0, 20)}...`, 'green');
    log(`✓ Service Role Key: ${appServiceKey ? appServiceKey.substring(0, 20) + '...' : 'Não configurada'}`, 
        appServiceKey ? 'green' : 'yellow');

    try {
      // Teste com anon key
      const supabaseApp = createClient(appUrl, appKey);
      
      const { data, error } = await supabaseApp
        .from('artistas')
        .select('count', { count: 'exact', head: true });

      if (error) {
        log(`❌ Erro ao conectar: ${error.message}`, 'red');
        log(`   Código: ${error.code || 'N/A'}`, 'yellow');
      } else {
        log('✅ Conexão bem-sucedida!', 'green');
        log(`   Tabela 'artistas' acessível`, 'green');
      }

      // Teste com service role key se disponível
      if (appServiceKey) {
        log('\n   Testando Service Role Key...', 'cyan');
        const supabaseAppAdmin = createClient(appUrl, appServiceKey);
        const { error: adminError } = await supabaseAppAdmin
          .from('artistas')
          .select('count', { count: 'exact', head: true });

        if (adminError) {
          log(`   ⚠️ Service Role Key com problema: ${adminError.message}`, 'yellow');
        } else {
          log('   ✅ Service Role Key funcionando corretamente', 'green');
        }
      }
    } catch (err) {
      log(`❌ Erro na conexão: ${err.message}`, 'red');
    }
  }

  // Resumo
  log('\n' + '='.repeat(60), 'cyan');
  log('✅ Teste concluído!', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
}

// Executa o teste
testSupabaseConnection().catch(err => {
  log(`\n❌ Erro fatal: ${err.message}`, 'red');
  process.exit(1);
});
