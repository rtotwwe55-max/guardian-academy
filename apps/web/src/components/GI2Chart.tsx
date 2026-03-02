'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GI2ChartProps {
  scores: number[];
  labels?: string[];
}

export function GI2Chart({ scores, labels }: GI2ChartProps) {
  const data = scores.map((score, idx) => ({
    name: labels?.[idx] || `Assessment ${idx + 1}`,
    gi2: score,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Integrity Index (GI²) Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis domain={[0, 10]} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value) => (value as number).toFixed(2)}
          />
          <Legend />
          <Bar
            dataKey="gi2"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="GI² Score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
