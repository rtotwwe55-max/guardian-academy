'use client';

import { SECTORS, INDICATORS } from 'core';

interface HeatmapData {
  sector: string;
  value: number;
}

export function SectorHeatmap() {
  // Sample data - in real app, this would come from assessments
  const heatmapData: HeatmapData[] = SECTORS.map((sector, idx) => ({
    sector,
    value: Math.random() * 100,
  }));

  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-600';
    if (value >= 60) return 'bg-green-400';
    if (value >= 40) return 'bg-yellow-400';
    if (value >= 20) return 'bg-orange-400';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Integrity by Sector</h2>
      <div className="space-y-4">
        {heatmapData.map((item) => (
          <div key={item.sector} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">{item.sector}</span>
              <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                {item.value.toFixed(1)}%
              </span>
            </div>
            <div className="h-8 bg-gray-200 rounded overflow-hidden">
              <div
                className={`h-full ${getColor(item.value)} transition-all duration-300`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
