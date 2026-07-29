interface MetricCardProps {
  title: string;
  value: number;
  updatedAt: Date;
}

export default function MetricCard({ title, value, updatedAt }: MetricCardProps) {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const formattedDate = updatedAt.toLocaleDateString('pt-BR');
  const formattedTime = updatedAt.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-[#2A1454] rounded-xl p-6 text-white">
      <p className="text-xs font-semibold tracking-wide text-purple-200 uppercase mb-3">
        {title}
      </p>
      <p className="text-3xl font-bold mb-3">{formattedValue}</p>
      <p className="text-xs text-purple-300">
        Atualizado em: {formattedDate} às {formattedTime}
      </p>
    </div>
  );
}