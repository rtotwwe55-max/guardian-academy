import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getUserScheduledReports,
  createScheduledReport,
} from '@/lib/store';
import type { ScheduledReport } from 'core';

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * GET /api/reports/scheduled
 * Get all scheduled reports for the current user
 */
export async function GET(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const reports = await getUserScheduledReports(verify.username!);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching scheduled reports:', error);
    return NextResponse.json({ error: 'failed to fetch reports' }, { status: 500 });
  }
}

/**
 * POST /api/reports/scheduled
 * Create a new scheduled report
 * Body: {
 *   type: 'summary' | 'detailed' | 'trend' | 'custom',
 *   format: 'json' | 'csv' | 'pdf' | 'html',
 *   frequency: 'daily' | 'weekly' | 'monthly',
 *   dayOfWeekOrMonth?: number,
 *   timeOfDay?: string (HH:MM format),
 *   recipients: string[],
 *   enabled: boolean
 * }
 */
export async function POST(request: NextRequest) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.type ||
      !body.format ||
      !body.frequency ||
      !Array.isArray(body.recipients) ||
      body.recipients.length === 0
    ) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
    }

    const newReport: ScheduledReport = {
      id: '',
      username: verify.username!,
      type: body.type,
      format: body.format,
      frequency: body.frequency,
      dayOfWeekOrMonth: body.dayOfWeekOrMonth,
      timeOfDay: body.timeOfDay || '09:00',
      recipients: body.recipients,
      enabled: body.enabled !== false,
      createdAt: new Date().toISOString(),
    };

    const reportId = await createScheduledReport(newReport);

    if (!reportId) {
      return NextResponse.json({ error: 'failed to create report' }, { status: 500 });
    }

    return NextResponse.json({ id: reportId, report: { ...newReport, id: reportId } }, { status: 201 });
  } catch (error) {
    console.error('Error creating scheduled report:', error);
    return NextResponse.json({ error: 'failed to create report' }, { status: 500 });
  }
}
