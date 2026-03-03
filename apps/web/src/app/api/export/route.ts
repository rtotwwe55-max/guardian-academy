import { NextResponse } from 'next/server';
import { exportReport } from 'core';
import type { ReportFormat } from 'core';
import { verifyToken } from '@/lib/auth';
import { generateReport, saveReport } from '@/lib/store';

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * GET /api/export
 * Export user data in specified format (csv, json, html, pdf)
 * Query params:
 *   - format: 'csv' | 'json' | 'html' | 'pdf' (default: csv)
 *   - reportType: 'summary' | 'detailed' (default: summary) - for report exports
 *   - startDate: ISO date string (optional)
 *   - endDate: ISO date string (optional)
 */
export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  const url = new URL(request.url);
  const format = (url.searchParams.get('format') || 'csv') as ReportFormat;
  const reportType = (url.searchParams.get('reportType') || 'summary') as 'summary' | 'detailed';
  const startDate = url.searchParams.get('startDate') || undefined;
  const endDate = url.searchParams.get('endDate') || undefined;

  // Validate format
  if (!['csv', 'json', 'html', 'pdf'].includes(format)) {
    return NextResponse.json({ error: 'invalid format' }, { status: 400 });
  }

  try {
    // Generate report
    const report = await generateReport(verify.username!, reportType, { startDate, endDate });

    if (!report) {
      return NextResponse.json({ error: 'no data available' }, { status: 404 });
    }

    // Export in requested format
    const { content, mimeType, filename } = exportReport(report, format);

    // For PDF format, we're currently returning HTML that can be printed to PDF
    // In production, you'd want to use a library like puppeteer
    if (format === 'pdf') {
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename.replace('.pdf', '.html')}"`,
        },
      });
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'export failed' }, { status: 500 });
  }
}

/**
 * POST /api/export
 * Save a report to the database
 * Body: { reportType?: 'summary' | 'detailed', startDate?: string, endDate?: string }
 */
export async function POST(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const body = await request.json();
    const reportType = body.reportType || 'summary';
    const startDate = body.startDate || undefined;
    const endDate = body.endDate || undefined;

    const report = await generateReport(verify.username!, reportType, { startDate, endDate });

    if (!report) {
      return NextResponse.json({ error: 'no data available' }, { status: 404 });
    }

    const reportId = await saveReport(verify.username!, report, {
      format: 'generated',
      notes: body.notes,
    });

    return NextResponse.json({ reportId, report });
  } catch (error) {
    console.error('Report save error:', error);
    return NextResponse.json({ error: 'failed to save report' }, { status: 500 });
  }
}
