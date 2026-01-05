'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: any }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Spending by Category</h3>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}