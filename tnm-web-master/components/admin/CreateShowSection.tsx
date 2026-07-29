'use client';

import { useEffect, useRef, useState } from 'react';

interface ArtistaOpcao {
  id: string;
  pseudonimo_artistico: string;
}

export default function CreateShowSection() {
  const [artistas, setArtistas] = useState<ArtistaOpcao[]>([]);
  const [artistaId, setArtistaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [horaEvento, setHoraEvento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function carregarArtistas() {
      try {
        const resp = await fetch('/api/admin/artistas');
        const json = await resp.json();
        if (resp.ok && json.success) {
          setArtistas(json.artistas.map((a: ArtistaOpcao) => ({ id: a.id, pseudonimo_artistico: a.pseudonimo_artistico })));
        }
      } catch {
        // silencioso: o select fica vazio e o admin ainda vê o erro ao tentar cadastrar
      }
    }
    carregarArtistas();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setFileName(file.name);
    }
  }

  function limparFormulario() {
    setArtistaId('');
    setTitulo('');
    setDateTime('');
    setHoraEvento('');
    setEndereco('');
    setTicketUrl('');
    setWhatsapp('');
    setBannerFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!artistaId) {
      setErro('Selecione o artista do show.');
      return;
    }
    if (!titulo || !dateTime || !endereco) {
      setErro('Preencha título, data/horário e local.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('artista_id', artistaId);
      formData.set('titulo_evento', titulo);
      formData.set('data_evento', dateTime);
      formData.set('hora_evento', horaEvento);
      formData.set('local_nome', endereco);
      formData.set('link_ingressos', ticketUrl);
      formData.set('contato_whatsapp', whatsapp);
      if (bannerFile) formData.set('banner', bannerFile);

      const resp = await fetch('/api/admin/shows', { method: 'POST', body: formData });
      const json = await resp.json();

      if (!resp.ok || !json.success) {
        setErro(json.error || 'Não foi possível cadastrar o show.');
        return;
      }

      setSucesso('Show cadastrado e enviado para moderação.');
      limparFormulario();
    } catch {
      setErro('Ocorreu um erro inesperado ao cadastrar o show.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-600 rounded-lg p-6">
      <h2 className="text-white text-lg font-bold mb-4 text-center">CADASTRAR NOVO SHOW</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Artista */}
        <div>
          <select
            value={artistaId}
            onChange={(e) => setArtistaId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          >
            <option value="" disabled>Selecione o artista...</option>
            {artistas.map((a) => (
              <option key={a.id} value={a.id}>{a.pseudonimo_artistico}</option>
            ))}
          </select>
        </div>

        {/* Título do show */}
        <div>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            placeholder="Título do show"
          />
        </div>

        {/* Album Cover Upload */}
        <div>
          <label className="block text-white text-xs font-semibold mb-2">CAPA DO ÁLBUM</label>
          <div className="border-2 border-dashed border-gray-400 rounded p-6 text-center bg-gray-500 cursor-pointer hover:bg-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="album-cover"
            />
            <label htmlFor="album-cover" className="cursor-pointer block">
              <div className="text-gray-300 mb-1">🎵</div>
              <p className="text-white font-semibold text-xs">Escolha o arquivo e arraste-o aqui</p>
              {fileName && <p className="text-yellow-300 mt-1 text-xs">{fileName}</p>}
            </label>
          </div>
        </div>

        {/* Date and Time */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="date"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
          <input
            type="time"
            value={horaEvento}
            onChange={(e) => setHoraEvento(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>

        {/* Address */}
        <div>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            placeholder="Endereço"
          />
        </div>

        {/* Ticket URL */}
        <div>
          <input
            type="url"
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            placeholder="URL da Venda de Ingressos"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            placeholder="Whatsapp de Contato"
          />
        </div>

        {erro && <p className="text-red-400 text-xs">{erro}</p>}
        {sucesso && <p className="text-green-400 text-xs">{sucesso}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-bold py-3 px-6 rounded text-sm transition-colors"
        >
          {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
        </button>
      </form>
    </div>
  );
}
