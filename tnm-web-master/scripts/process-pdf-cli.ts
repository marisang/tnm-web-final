#!/usr/bin/env tsx

/**
 * Script CLI para processar PDFs via linha de comando
 * 
 * Uso:
 *   npx tsx scripts/process-pdf-cli.ts <arquivo.pdf> [--output <formato>] [--save <diretório>]
 * 
 * Exemplos:
 *   npx tsx scripts/process-pdf-cli.ts documento.pdf
 *   npx tsx scripts/process-pdf-cli.ts documento.pdf --output json --save ./output
 *   npx tsx scripts/process-pdf-cli.ts documento.pdf --output csv --save ./exports
 */

import * as fs from 'fs';
import * as path from 'path';
import { processPDF, exportToCSV, exportToJSON } from '../lib/pdfProcessor';

interface CLIOptions {
  inputFile: string;
  outputFormat: 'json' | 'csv' | 'both';
  saveDirectory?: string;
  verbose: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Processador de PDFs - CLI

Uso:
  npx tsx scripts/process-pdf-cli.ts <arquivo.pdf> [opções]

Opções:
  --output, -o <formato>    Formato de saída: json, csv, both (padrão: json)
  --save, -s <diretório>    Diretório para salvar os arquivos (padrão: ./output)
  --verbose, -v             Modo verbose (mostra mais detalhes)
  --help, -h                Mostra esta mensagem

Exemplos:
  npx tsx scripts/process-pdf-cli.ts documento.pdf
  npx tsx scripts/process-pdf-cli.ts documento.pdf --output both --save ./exports
  npx tsx scripts/process-pdf-cli.ts documento.pdf -o csv -s ./output -v
    `);
    process.exit(0);
  }
  
  const options: CLIOptions = {
    inputFile: args[0],
    outputFormat: 'json',
    saveDirectory: './output',
    verbose: false
  };
  
  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--output':
      case '-o':
        const format = args[++i] as 'json' | 'csv' | 'both';
        if (!['json', 'csv', 'both'].includes(format)) {
          console.error('Formato inválido. Use: json, csv ou both');
          process.exit(1);
        }
        options.outputFormat = format;
        break;
        
      case '--save':
      case '-s':
        options.saveDirectory = args[++i];
        break;
        
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
        
      default:
        console.error(`Opção desconhecida: ${args[i]}`);
        process.exit(1);
    }
  }
  
  return options;
}

function ensureDirectory(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const options = parseArgs();
  
  // Valida arquivo de entrada
  if (!fs.existsSync(options.inputFile)) {
    console.error(`❌ Arquivo não encontrado: ${options.inputFile}`);
    process.exit(1);
  }
  
  if (!options.inputFile.toLowerCase().endsWith('.pdf')) {
    console.error('❌ O arquivo deve ter extensão .pdf');
    process.exit(1);
  }
  
  console.log('📄 Processando PDF...');
  if (options.verbose) {
    console.log(`   Arquivo: ${options.inputFile}`);
    console.log(`   Formato: ${options.outputFormat}`);
    console.log(`   Destino: ${options.saveDirectory}`);
  }
  
  try {
    // Lê o arquivo
    const buffer = fs.readFileSync(options.inputFile);
    const fileName = path.basename(options.inputFile);
    
    // Processa o PDF
    const startTime = Date.now();
    const result = await processPDF(buffer, fileName);
    const processingTime = Date.now() - startTime;
    
    // Mostra resultados
    console.log('\n✅ Processamento concluído!');
    console.log(`   Tempo: ${processingTime}ms`);
    console.log(`   Páginas: ${result.pageCount}`);
    console.log(`   Tipo: ${result.structure.type}`);
    console.log(`   Confiança: ${(result.structure.confidence * 100).toFixed(1)}%`);
    console.log(`   Tabelas encontradas: ${result.tables.length}`);
    
    if (options.verbose && result.structure.detectedPatterns.length > 0) {
      console.log(`   Padrões detectados: ${result.structure.detectedPatterns.join(', ')}`);
    }
    
    // Cria diretório de saída
    if (options.saveDirectory) {
      ensureDirectory(options.saveDirectory);
    }
    
    const baseName = path.basename(fileName, '.pdf');
    let savedFiles: string[] = [];
    
    // Salva JSON
    if (options.outputFormat === 'json' || options.outputFormat === 'both') {
      const jsonPath = path.join(options.saveDirectory!, `${baseName}_processed.json`);
      const jsonContent = exportToJSON(result);
      fs.writeFileSync(jsonPath, jsonContent);
      savedFiles.push(jsonPath);
      
      if (options.verbose) {
        console.log(`\n📦 JSON salvo: ${jsonPath}`);
      }
    }
    
    // Salva CSV
    if ((options.outputFormat === 'csv' || options.outputFormat === 'both') && result.tables.length > 0) {
      result.tables.forEach((table, index) => {
        const csvPath = path.join(
          options.saveDirectory!,
          `${baseName}_tabela_${index + 1}.csv`
        );
        const csvContent = exportToCSV(table);
        fs.writeFileSync(csvPath, csvContent);
        savedFiles.push(csvPath);
        
        if (options.verbose) {
          console.log(`\n📊 CSV salvo: ${csvPath}`);
          console.log(`   Linhas: ${table.metadata.rowCount}`);
          console.log(`   Colunas: ${table.metadata.columnCount}`);
          console.log(`   Cabeçalhos: ${table.headers.join(', ')}`);
        }
      });
    }
    
    // Resumo final
    console.log(`\n💾 Arquivos salvos: ${savedFiles.length}`);
    savedFiles.forEach(file => console.log(`   - ${file}`));
    
    // Mostra preview dos dados se verbose
    if (options.verbose && result.tables.length > 0) {
      console.log('\n📋 Preview dos dados:');
      result.tables.forEach((table, idx) => {
        console.log(`\n   Tabela ${idx + 1}:`);
        console.log(`   ${table.headers.join(' | ')}`);
        console.log(`   ${'-'.repeat(table.headers.join(' | ').length)}`);
        
        table.rows.slice(0, 3).forEach(row => {
          const values = table.headers.map(h => String(row[h]));
          console.log(`   ${values.join(' | ')}`);
        });
        
        if (table.rows.length > 3) {
          console.log(`   ... e mais ${table.rows.length - 3} linhas`);
        }
      });
    }
    
    console.log('\n✨ Pronto!\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao processar PDF:');
    console.error(`   ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    
    if (options.verbose && error instanceof Error) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

// Executa o script
main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
