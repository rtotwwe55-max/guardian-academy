'use client';

import { useState } from 'react';
import { calculateGI2, type IntegrityScore } from 'core';
import { SectorHeatmap } from './SectorHeatmap';
import { MultiDimensionChart } from './MultiDimensionChart';
import { GI2Chart } from './GI2Chart';
import { MetricCard } from './MetricCard';

export function Dashboard() {
  // Sample assessment data
  const assessments: IntegrityScore[] = [
    { truth: 4, responsibility: 3, restraint: 3, powerRisk: 2 },
    { truth: 3, responsibility: 4, restraint: 2, powerRisk: 1 },
    { truth: 5, responsibility: 4, restraint: 4, powerRisk: 2 },
    { truth: 4, responsibility: 3, restraint: 3, powerRisk: 3 },
  ];

  const currentAssessment = assessments[assessments.length - 1];
  const gi2Scores = assessments.map((a) => calculateGI2([a]));
  const overallGI2 = calculateGI2(assessments);

  const avgTruth = (assessments.reduce((sum, a) => sum + a.truth, 0) / assessments.length).toFixed(2);
  const avgResponsibility = (assessments.reduce((sum, a) => sum + a.responsibility, 0) / assessments.length).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Guardian Academy</h1>
          <p className="text-gray-600 mt-2">Integrity Metrics Dashboard</p>
        </div>
        <div>
          <a
            href="/survey"
            className="text-blue-600 font-medium hover:underline"
          >
            + Take Survey
          </a>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Overall GI² Score"
          value={overallGI2}
          color="blue"
          icon="📊"
        />
        <MetricCard
          title="Avg Truth"
          value={avgTruth}
          unit="/5"
          color="green"
          icon="✓"
        />
        <MetricCard
          title="Avg Responsibility"
          value={avgResponsibility}
          unit="/5"
          color="green"
          icon="⚖️"
        />
        <MetricCard
          title="Assessments"
          value={assessments.length}
          color="yellow"
          icon="📋"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MultiDimensionChart score={currentAssessment} />
        <GI2Chart scores={gi2Scores} />
      </div>

      {/* Sector Heatmap */}
      <div className="mb-8">
        <SectorHeatmap />
      </div>

      {/* Assessment Details */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Current Assessment</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(currentAssessment).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded p-4 border border-gray-200">
              <p className="text-xs uppercase text-gray-500 font-semibold">{key}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
