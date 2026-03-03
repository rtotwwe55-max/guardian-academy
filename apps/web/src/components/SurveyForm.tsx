'use client';

import { useState, useEffect } from 'react';
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
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      fetchHistory(savedToken);
    }
  }, []);

  const fetchHistory = async (authToken: string) => {
    try {
      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      } else if (res.status === 401) {
        setError('Token expired. Please log in again.');
        logout();
      }
    } catch (err) {
      setError('Failed to fetch history');
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!authUsername || !password) {
      setError('Please enter username and password');
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authUsername, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setToken(data.token);
        setUsername(data.username);
        setAuthUsername('');
        setPassword('');
        setIsSignup(false);
        fetchHistory(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login request failed');
    }
  };

  const handleSignup = async () => {
    setError('');
    if (!authUsername || !password) {
      setError('Please enter username and password');
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authUsername, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setError('');
        setIsSignup(false);
        setError('Account created! Please log in.');
        // optionally auto-login after signup
        setTimeout(() => handleLogin(), 1000);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Signup request failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setHistory([]);
    setAuthUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateGI2([
      { truth, responsibility, restraint, powerRisk },
    ]);
    setResult(score);
    const now = new Date().toISOString();

    if (token) {
      // save to backend with auth token
      try {
        const res = await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ entry: { score, timestamp: now } }),
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        } else if (res.status === 401) {
          setError('Token expired. Please log in again.');
          logout();
        } else {
          setError('Failed to save entry');
        }
      } catch (err) {
        setError('Failed to submit entry');
      }
    } else {
      // save locally only
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
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {!token && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-3">
            {isSignup ? 'Create Account' : 'Login to sync history'}
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              placeholder="username"
              className="block w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="block w-full border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={isSignup ? handleSignup : handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                {isSignup ? 'Back to Login' : 'Create Account'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Demo: username=<code>demo</code>, password=<code>demo123</code>
            </p>
          </div>
        </div>
      )}

      {token && username && (
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
              onClick={async () => {
                if (!token) {
                  setError('Must be logged in to export');
                  return;
                }
                try {
                  const res = await fetch('/api/export', {
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  if (res.ok) {
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'survey-history.csv';
                    a.click();
                  } else if (res.status === 401) {
                    setError('Token expired. Please log in again.');
                    logout();
                  } else {
                    setError('Export failed');
                  }
                } catch (err) {
                  setError('Export request failed');
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={async () => {
                if (!token) {
                  setHistory([]);
                  return;
                }
                try {
                  const res = await fetch('/api/history', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  if (res.ok) {
                    setHistory([]);
                  } else if (res.status === 401) {
                    setError('Token expired. Please log in again.');
                    logout();
                  } else {
                    setError('Failed to clear history');
                  }
                } catch (err) {
                  setError('Clear request failed');
                }
              }}
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
