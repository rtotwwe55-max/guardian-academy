'use client';

import { useState } from 'react';
import { calculateGI2, arrayToCSV, downloadCSV } from 'core';
import type { IntegrityScore } from 'core';
import Link from 'next/link';

export function SurveyForm() {
  const [truth, setTruth] = useState(3);
  const [responsibility, setResponsibility] = useState(3);
  const [restraint, setRestraint] = useState(3);
  const [powerRisk, setPowerRisk] = useState(3);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<{ score: number; timestamp: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateGI2([
      { truth, responsibility, restraint, powerRisk },
    ]);
    setResult(score);
    const now = new Date().toISOString();
    setHistory((prev) => [...prev, { score, timestamp: now }]);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Integrity Survey</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Truth (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={truth}
            onChange={(e) => setTruth(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Responsibility (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={responsibility}
            onChange={(e) => setResponsibility(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Restraint (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={restraint}
            onChange={(e) => setRestraint(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Power Risk (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={powerRisk}
            onChange={(e) => setPowerRisk(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <strong>Result:</strong> GI² score = {result}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold">History</h2>
          <ul className="list-decimal list-inside">
            {history.map((entry, i) => (
              <li key={i}>
                {entry.timestamp}: {entry.score}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const csv = arrayToCSV(history, ['timestamp', 'score']);
              downloadCSV(csv, 'survey-history.csv');
            }}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
