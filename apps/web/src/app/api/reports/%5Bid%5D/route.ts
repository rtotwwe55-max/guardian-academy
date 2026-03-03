import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSavedReport } from '@/lib/store';

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * GET /api/reports/[id]
 * Get a specific saved report by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const report = await getSavedReport(params.id);

    if (!report) {
      return NextResponse.json({ error: 'report not found' }, { status: 404 });
    }

    // Verify the report belongs to the current user
    if (report.username !== verify.username) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'failed to fetch report' }, { status: 500 });
  }
}
