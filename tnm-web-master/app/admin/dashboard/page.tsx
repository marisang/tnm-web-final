import Header from '@/components/Header';
import MetricCard from '@/components/admin/MetricCard';
import ImportacaoRelatorios from '@/components/admin/ImportacaoRelatorios';

import { getDashboardMetrics } from '@/lib/dashboardData';

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xl">👤</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Olá, Usuário Adm!</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <MetricCard
                title="Faturamento Total Bruto"
                value={metrics.faturamentoTotalBruto}
                updatedAt={metrics.atualizadoEm}
              />
              <MetricCard
                title="Valor Retido pela TNM"
                value={metrics.valorRetidoTNM}
                updatedAt={metrics.atualizadoEm}
              />
              <MetricCard
                title="Repasses Pendentes"
                value={metrics.repassesPendentes}
                updatedAt={metrics.atualizadoEm}
              />
            </div>

            {/* Importação de Relatórios */}
            <div>
              <ImportacaoRelatorios />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}