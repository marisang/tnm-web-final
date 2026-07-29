import Header from '@/components/Header';
import { getConciliacaoData } from '@/lib/conciliacaoData';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default async function ConciliacaoPage() {
  const { linhas, duplicateRowIds, resumo } = await getConciliacaoData();
  const duplicadas = new Set(duplicateRowIds);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Conciliação e Splits</h1>
            </div>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Apurado (Obras + Fonogramas)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalBruto)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">ISRCs Duplicados Encontrados</p>
              <p className="text-2xl font-bold text-red-600">
                {new Set(linhas.filter((l) => duplicadas.has(l.id) && l.isrc).map((l) => l.isrc)).size}
              </p>
            </div>
          </div>

          {/* Tabela de Obras/Fonogramas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-purple-600">
              <h2 className="text-xl font-bold text-white">Obras e Fonogramas</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISRC / ISWC
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Divisão de Receitas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Repassado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {linhas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        Nenhuma obra ou fonograma encontrado. Importe relatórios para popular esta tela.
                      </td>
                    </tr>
                  ) : (
                    linhas.map((linha) => {
                      const isDuplicada = duplicadas.has(linha.id);
                      return (
                        <tr key={linha.id} className={isDuplicada ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{linha.titulo || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={isDuplicada ? 'font-semibold text-red-700' : 'text-gray-500'}>
                              {linha.isrc || linha.iswc || '—'}
                            </span>
                            {isDuplicada && (
                              <span className="ml-2 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800 px-2 py-0.5">
                                Duplicado
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {linha.percentual != null ? `${linha.percentual}%` : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-right font-semibold">
                            {linha.valor != null ? formatCurrency(linha.valor) : '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
