'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { IntegrityScore } from 'core';

interface MultiDimensionChartProps {
  score: IntegrityScore;
}

export function MultiDimensionChart({ score }: MultiDimensionChartProps) {
  const data = [
    {
      dimension: 'Truth',
      value: score.truth * 20, // Scale to 0-100
    },
    {
      dimension: 'Responsibility',
      value: score.responsibility * 20,
    },
    {
      dimension: 'Restraint',
      value: score.restraint * 20,
    },
    {
      dimension: 'Power Risk',
      value: Math.max(0, 100 - score.powerRisk * 20), // Inverse: lower risk is better
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Integrity Dimensions</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="dimension" stroke="#6b7280" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
            formatter={(value) => `${(value as number).toFixed(1)}%`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
