'use client';

import { useState } from 'react';
import { calculateGI2, arrayToCSV, downloadCSV } from 'core';
import type { IntegrityScore } from 'core';
import Link from 'next/link';
import { useEffect } from 'react';

export function SurveyForm() {
  const [truth, setTruth] = useState(3);
  const [responsibility, setResponsibility] = useState(3);
  const [restraint, setRestraint] = useState(3);
  const [powerRisk, setPowerRisk] = useState(3);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<{ score: number; timestamp: string }[]>([]);
  const [session, setSession] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loginName, setLoginName] = useState('');

  // load session from localStorage on mount
  useEffect(() => {
    const s = localStorage.getItem('session');
    const u = localStorage.getItem('username');
    if (s && u) {
      setSession(s);
      setUsername(u);
      fetchHistory(s);
    }
  }, []);

  const fetchHistory = async (s: string) => {
    try {
      const res = await fetch(`/api/history?session=${s}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
      }
    } catch {}
  };

  const performLogin = async () => {
    if (!loginName) return;
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginName }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('session', data.session);
      localStorage.setItem('username', loginName);
      setSession(data.session);
      setUsername(loginName);
      fetchHistory(data.session);
    }
  };

  const logout = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('username');
    setSession(null);
    setUsername(null);
    setHistory([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateGI2([
      { truth, responsibility, restraint, powerRisk },
    ]);
    setResult(score);
    const now = new Date().toISOString();

    if (session) {
      // save to backend
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session, entry: { score, timestamp: now } }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
      }
    } else {
      setHistory((prev) => [...prev, { score, timestamp: now }]);
    }
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
      {!session && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-2">Login to sync history</h2>
          <div className="flex gap-2">
            <input
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="username"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={performLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
      {session && username && (
        <div className="mt-6 text-sm text-gray-600 flex items-center gap-4">
          Logged in as <strong>{username}</strong>
          <button
            onClick={logout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
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
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                const csv = arrayToCSV(history, ['timestamp', 'score']);
                downloadCSV(csv, 'survey-history.csv');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => setHistory([])}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear History
            </button>
          </div>
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
