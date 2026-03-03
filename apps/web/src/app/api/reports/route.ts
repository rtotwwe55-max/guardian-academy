import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserReports } from '@/lib/store';

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * GET /api/reports
 * Get all saved reports for the current user
 */
export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const reports = await getUserReports(verify.username!);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'failed to fetch reports' }, { status: 500 });
  }
}
