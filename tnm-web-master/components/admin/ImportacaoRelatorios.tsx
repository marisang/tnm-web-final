'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

type Origem = '' | 'onerpm' | 'ecad' | 'abramus';

interface ResumoImportacao {
  linhasNoArquivo: number;
  linhasIgnoradasSemValor: number;
  duplicadasIgnoradas: number;
  importadasComSucesso: number;
}

export default function ImportacaoRelatorios() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [origem, setOrigem] = useState<Origem>('');
  const [erro, setErro] = useState('');
  const [avisos, setAvisos] = useState<string[]>([]);
  const [resumo, setResumo] = useState<ResumoImportacao | null>(null);
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extensoesValidas = ['.csv', '.xlsx', '.pdf'];

  function validarArquivo(file: File): boolean {
    const nome = file.name.toLowerCase();
    return extensoesValidas.some((ext) => nome.endsWith(ext));
  }

  function processarArquivo(file: File) {
    setErro('');
    setAvisos([]);
    setResumo(null);
    if (!validarArquivo(file)) {
      setErro('Formato inválido. Apenas .csv, .xlsx e .pdf são aceitos.');
      return;
    }
    setArquivo(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processarArquivo(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file);
  }

  async function handleImportar() {
    if (!arquivo) {
      setErro('Selecione um arquivo antes de importar.');
      return;
    }
    if (!origem) {
      setErro('Selecione a origem do arquivo.');
      return;
    }

    setErro('');
    setAvisos([]);
    setResumo(null);
    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append('file', arquivo);
      formData.append('origem', origem);

      const response = await fetch('/api/importacoes', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (!response.ok || !resultado.success) {
        setErro(resultado.error || 'Não foi possível importar o arquivo.');
        setAvisos(resultado.avisos || []);
        return;
      }

      setResumo(resultado.resumo);
      setAvisos(resultado.avisos || []);
      setArquivo(null);
      setOrigem('');
      if (inputRef.current) inputRef.current.value = '';

      // Atualiza os indicadores do Dashboard com os novos dados importados.
      router.refresh();
    } catch {
      setErro('Ocorreu um erro inesperado ao importar o arquivo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-gray-600 rounded-lg p-6">
      <h2 className="text-white text-lg font-bold mb-4 text-center">
        IMPORTAÇÃO DE RELATÓRIOS
      </h2>

      <div className="mb-4">
        <label className="block text-white text-xs font-semibold mb-2">
          ORIGEM DO ARQUIVO
        </label>
        <select
          value={origem}
          onChange={(e) => {
            setOrigem(e.target.value as Origem);
            setErro('');
            setResumo(null);
          }}
          className="w-full px-3 py-2 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        >
          <option value="" disabled>Selecione a origem...</option>
          <option value="onerpm">ONErpm</option>
          <option value="ecad">ECAD</option>
          <option value="abramus">ABRAMUS</option>
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-yellow-400 bg-gray-400'
            : 'border-gray-400 bg-gray-500 hover:bg-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="text-3xl mb-2">📂</div>

        {arquivo ? (
          <div>
            <p className="text-yellow-300 font-semibold text-sm">{arquivo.name}</p>
            <p className="text-gray-300 text-xs mt-1">
              {(arquivo.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-white font-semibold text-sm">
              Arraste o arquivo aqui ou clique para selecionar
            </p>
            <p className="text-gray-300 text-xs mt-1">Formatos aceitos: .csv, .xlsx, .pdf</p>
          </div>
        )}
      </div>

      {erro && <p className="text-red-400 text-xs mt-2">{erro}</p>}

      {avisos.length > 0 && (
        <ul className="text-yellow-300 text-xs mt-2 list-disc list-inside space-y-0.5">
          {avisos.map((aviso, i) => (
            <li key={i}>{aviso}</li>
          ))}
        </ul>
      )}

      {resumo && (
        <div className="text-green-400 text-xs mt-2 space-y-0.5">
          <p>✓ {resumo.importadasComSucesso} receita(s) importada(s) com sucesso.</p>
          {resumo.duplicadasIgnoradas > 0 && (
            <p>↺ {resumo.duplicadasIgnoradas} linha(s) ignorada(s) por já existirem (duplicidade).</p>
          )}
          {resumo.linhasIgnoradasSemValor > 0 && (
            <p>⚠ {resumo.linhasIgnoradasSemValor} linha(s) ignorada(s) por não terem valor válido.</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleImportar}
        disabled={enviando}
        className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-bold py-3 px-6 rounded text-sm transition-colors"
      >
        {enviando ? 'IMPORTANDO...' : 'IMPORTAR'}
      </button>
    </div>
  );
}
