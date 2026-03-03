import { NextResponse } from 'next/server';
import { getAllScheduledReports, getHistory, generateReport, updateScheduledReport } from '@/lib/store';
import { sendReportEmail } from '@/lib/email';
import { exportReport } from 'core';
import type { ScheduledReport, ReportType } from 'core';

/**
 * Check if a scheduled report should be executed now
 */
function shouldExecuteReport(report: ScheduledReport): boolean {
  if (!report.enabled) return false;

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const dayOfWeek = now.getDay();
  const dayOfMonth = now.getDate();

  // Parse timeOfDay if provided
  let targetHour = 9;
  let targetMinute = 0;

  if (report.timeOfDay) {
    const [h, m] = report.timeOfDay.split(':').map(Number);
    targetHour = h ?? 9;
    targetMinute = m ?? 0;
  }

  // Check if we're in the target time window (within 60 minutes)
  const isTargetTime = hour === targetHour && minute >= targetMinute && minute < targetMinute + 60;

  if (!isTargetTime) return false;

  // Check frequency
  switch (report.frequency) {
    case 'daily':
      return true;

    case 'weekly':
      // Execute on specified day (or Monday if not specified)
      const targetDay = report.dayOfWeekOrMonth ?? 1; // Monday = 1
      return dayOfWeek === targetDay;

    case 'monthly':
      // Execute on specified date (or 1st if not specified)
      const targetDate = report.dayOfWeekOrMonth ?? 1;
      return dayOfMonth === targetDate;

    default:
      return false;
  }
}

/**
 * Process a single scheduled report
 */
async function processScheduledReport(report: ScheduledReport): Promise<boolean> {
  try {
    // Get user's history
    const history = await getHistory(report.username);
    if (!history || history.length === 0) {
      console.log(`No history for user ${report.username}`);
      return false;
    }

    // Generate the report
    const generatedReport = await generateReport(report.username, report.type as ReportType);
    if (!generatedReport) {
      console.log(`Failed to generate report for user ${report.username}`);
      return false;
    }

    // Export in the requested format
    const { content } = exportReport(generatedReport, report.format);

    // Send emails to all recipients
    let sentCount = 0;
    for (const recipient of report.recipients) {
      const emailSent = await sendReportEmail(
        recipient,
        `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`,
        content,
        report.format === 'html' ? 'html' : 'plain'
      );
      if (emailSent) sentCount++;
    }

    // Update the report's last generated time
    const now = new Date().toISOString();
    await updateScheduledReport(report.id, {
      lastGenerated: now,
      nextScheduled: calculateNextScheduled(report, now),
    });

    console.log(
      `Processed scheduled report ${report.id}: sent to ${sentCount}/${report.recipients.length} recipients`
    );
    return sentCount > 0;
  } catch (error) {
    console.error(`Error processing scheduled report ${report.id}:`, error);
    return false;
  }
}

/**
 * Calculate the next scheduled time for a report
 */
function calculateNextScheduled(report: ScheduledReport, fromTime: string): string {
  const next = new Date(fromTime);
  const [hour, minute] = (report.timeOfDay || '09:00').split(':').map(Number);

  switch (report.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;

    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;

    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }

  next.setHours(hour, minute, 0, 0);
  return next.toISOString();
}

/**
 * POST /api/cron/process-reports
 * This endpoint should be called by a cron job service (e.g., EasyCron, AWS EventBridge, etc.)
 * 
 * Requires CRON_SECRET environment variable for authentication
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    // Get all enabled scheduled reports
    const allReports = await getAllScheduledReports();

    // Process each report that should execute now
    const reportsToProcess = allReports.filter(shouldExecuteReport);

    console.log(
      `Processing ${reportsToProcess.length} scheduled reports out of ${allReports.length} total`
    );

    let successCount = 0;
    const errors: Array<{ reportId: string; error: string }> = [];

    for (const report of reportsToProcess) {
      try {
        const success = await processScheduledReport(report);
        if (success) successCount++;
      } catch (error) {
        errors.push({
          reportId: report.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      processed: reportsToProcess.length,
      successful: successCount,
      failed: errors.length,
      errors,
    });
  } catch (error) {
    console.error('Error processing cron reports:', error);
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/process-reports
 * Health check endpoint to verify the cron handler is accessible
 */
export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret');

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Cron handler is operational. Send POST request to process reports.',
  });
}
