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
 * Map custom report types to supported types
 */
function mapReportType(type: ReportType): 'summary' | 'detailed' {
  switch (type) {
    case 'trend':
    case 'custom':
      return 'detailed'; // Map unsupported types to detailed
    default:
      return type as 'summary' | 'detailed';
  }
}

/**
 * Calculate the next scheduled time
 */
function calculateNextScheduled(report: ScheduledReport, from: string): string {
  const date = new Date(from);

  switch (report.frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
  }

  return date.toISOString();
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

    // Map the report type to a supported type
    const supportedType = mapReportType(report.type);

    // Generate the report
    const generatedReport = await generateReport(report.username, supportedType);
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
 * POST /api/cron/process-reports
 * Process all scheduled reports that are due
 * Called by an external cron service
 * Body expects:
 * {
 *   "cronSecret": "CRON_SECRET"
 * }
 */
export async function POST(request: Request) {
  try {
    // Verify the request is from our cron service
    const body = await request.json();
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || body.cronSecret !== cronSecret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Get all scheduled reports
    const allReports = await getAllScheduledReports();
    if (!allReports || allReports.length === 0) {
      return NextResponse.json({ processed: 0, message: 'no scheduled reports' });
    }

    // Process reports that are due
    let processedCount = 0;
    let successCount = 0;

    for (const report of allReports) {
      if (shouldExecuteReport(report)) {
        processedCount++;
        const success = await processScheduledReport(report);
        if (success) successCount++;
      }
    }

    return NextResponse.json({
      processed: processedCount,
      successful: successCount,
      message: `processed ${processedCount} reports, ${successCount} successful`,
    });
  } catch (error) {
    console.error('Error in cron endpoint:', error);
    return NextResponse.json({ error: 'failed to process reports' }, { status: 500 });
  }
}
