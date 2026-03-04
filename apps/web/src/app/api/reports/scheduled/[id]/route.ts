import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  updateScheduledReport,
  deleteScheduledReport,
} from '@/lib/store';

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * PUT /api/reports/scheduled/[id]
 * Update a scheduled report
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const body = await request.json();
    const success = await updateScheduledReport(id, body);

    if (!success) {
      return NextResponse.json({ error: 'failed to update report' }, { status: 500 });
    }

    return NextResponse.json({ message: 'report updated' });
  } catch (error) {
    console.error('Error updating scheduled report:', error);
    return NextResponse.json({ error: 'failed to update report' }, { status: 500 });
  }
}

/**
 * DELETE /api/reports/scheduled/[id]
 * Delete a scheduled report
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const success = await deleteScheduledReport(id);

    if (!success) {
      return NextResponse.json({ error: 'failed to delete report' }, { status: 500 });
    }

    return NextResponse.json({ message: 'report deleted' });
  } catch (error) {
    console.error('Error deleting scheduled report:', error);
    return NextResponse.json({ error: 'failed to delete report' }, { status: 500 });
  }
}
