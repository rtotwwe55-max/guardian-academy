'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Guardian Academy</h1>
          <p className="text-xl text-gray-600">Open Standards for Institutional Integrity</p>
        </div>

        {/* GI² Score Display */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">Guardian Integrity Score</p>
            <div className="text-6xl font-bold text-blue-600">GI²</div>
            <p className="text-gray-500 text-sm mt-2">Measuring Organizational Integrity</p>
          </div>

          <div className="grid grid-cols-5 gap-4 py-6 border-y border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Integrity</p>
              <p className="text-2xl font-bold text-blue-600">85</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Stability</p>
              <p className="text-2xl font-bold text-green-600">72</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Trust</p>
              <p className="text-2xl font-bold text-purple-600">88</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Sustain</p>
              <p className="text-2xl font-bold text-orange-600">79</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase">Power Risk</p>
              <p className="text-2xl font-bold text-red-600">45</p>
            </div>
          </div>

          <div className="mt-6 text-3xl font-bold text-emerald-600">Score: 75.8</div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/survey"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Take Survey
          </Link>
          <Link
            href="https://github.com/rtotwwe55-max/guardian-academy-1"
            target="_blank"
            className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            View on GitHub
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-white/80 backdrop-blur rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What is GI²?</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Guardian Integrity Score (GI²) is an open standard for measuring organizational integrity across five critical dimensions.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ <strong>Integrity:</strong> Alignment with stated values</li>
            <li>✅ <strong>Stability:</strong> Operational resilience</li>
            <li>✅ <strong>Trust:</strong> Stakeholder confidence</li>
            <li>✅ <strong>Sustainability:</strong> Long-term viability</li>
            <li>✅ <strong>Power Risk:</strong> Governance decentralization</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-600 text-sm">
          <p>Development Version | Standards-First Architecture</p>
          <Link
            href="https://github.com/rtotwwe55-max/guardian-academy-1#-documentation"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Read the Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
