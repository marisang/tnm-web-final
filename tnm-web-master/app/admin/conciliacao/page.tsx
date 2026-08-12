import Header from '@/components/Header';
import { getConciliacaoData } from '@/lib/conciliacaoData';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default async function ConciliacaoPage() {
  const { linhas, resumo } = await getConciliacaoData();

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
              <h1 className="text-3xl font-bold text-gray-800">Conciliação</h1>
            </div>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Arrecadado</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(resumo.totalBruto)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Repassado aos Artistas</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(resumo.totalRepassado)}</p>
            </div>
          </div>

          {/* Tabela de Artistas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-purple-600">
              <h2 className="text-xl font-bold text-white">Repasses por Artista</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artista
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Arrecadado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Repassado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {linhas.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                        Nenhum artista encontrado. Verifique se há transações financeiras cadastradas.
                      </td>
                    </tr>
                  ) : (
                    linhas.map((linha) => (
                      <tr key={linha.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {linha.titulo || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                          {linha.valorBruto != null ? formatCurrency(linha.valorBruto) : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 text-right font-semibold">
                          {linha.valor != null ? formatCurrency(linha.valor) : '—'}
                        </td>
                      </tr>
                    ))
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
