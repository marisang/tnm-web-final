'use client';

export type Prioridade = 'alta' | 'media' | 'baixa';

interface ShowCardProps {
  show: {
    id: string;
    title: string;
    banner: string;
    bannerUrl?: string;
    date: string;
    time: string;
    location: string;
  };
  prioridade: Prioridade;
  onPrioridadeChange: (prioridade: Prioridade) => void;
  onApprove: () => void;
  onReject: () => void;
  loading?: boolean;
}

const PRIORIDADE_LABELS: Record<Prioridade, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const PRIORIDADE_CORES: Record<Prioridade, string> = {
  alta: 'text-red-400',
  media: 'text-yellow-400',
  baixa: 'text-green-400',
};

export default function ShowCard({
  show,
  prioridade,
  onPrioridadeChange,
  onApprove,
  onReject,
  loading,
}: ShowCardProps) {
  return (
    <div className="bg-purple-900 rounded p-3 flex items-center gap-3 border-2 border-purple-800">
      {show.bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={show.bannerUrl}
          alt={`Banner do show ${show.title}`}
          className="w-20 h-20 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div className={`${show.banner} w-20 h-20 rounded flex items-center justify-center flex-shrink-0 text-center`}>
          <div className="text-purple-900 font-bold text-xs">
            <div>Banner</div>
            <div>do Show</div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-yellow-400 text-sm font-bold">{show.title}</h3>
        <div className="space-y-0.5 text-purple-200 text-xs">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{show.date} às {show.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{show.location}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-purple-300 text-xs">Prioridade:</span>
          <select
            value={prioridade}
            onChange={(e) => onPrioridadeChange(e.target.value as Prioridade)}
            disabled={loading}
            className={`bg-purple-800 border border-purple-600 rounded px-2 py-0.5 text-xs font-semibold disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-400 ${PRIORIDADE_CORES[prioridade]}`}
          >
            {(Object.keys(PRIORIDADE_LABELS) as Prioridade[]).map((p) => (
              <option key={p} value={p} className="text-white bg-purple-900">
                {PRIORIDADE_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onApprove}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
        >
          APROVAR
        </button>
        <button
          onClick={onReject}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded text-xs transition-colors"
        >
          RECUSAR
        </button>
      </div>
    </div>
  );
}
