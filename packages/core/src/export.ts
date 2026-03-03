import { UserReport, ReportFormat, HistoryEntry } from './types';
import { arrayToCSV } from './csv';

/**
 * Convert user report to JSON format
 */
export function reportToJSON(report: UserReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Convert user report to CSV format
 * Includes summary stats and history entries
 */
export function reportToCSV(report: UserReport): string {
  const lines: string[] = [];

  // Add report header
  lines.push('# Guardian Academy Report');
  lines.push(`Username,${report.username}`);
  lines.push(`Generated At,${report.generatedAt}`);
  
  if (report.period) {
    lines.push(`Period Start,${report.period.startDate}`);
    lines.push(`Period End,${report.period.endDate}`);
  }

  lines.push(''); // blank line

  // Add summary statistics
  lines.push('# Summary Statistics');
  lines.push(`Total Entries,${report.summary.totalEntries}`);
  lines.push(`Average Score,${report.summary.averageScore}`);
  lines.push(`Highest Score,${report.summary.highestScore}`);
  lines.push(`Lowest Score,${report.summary.lowestScore}`);
  lines.push('');

  // Add score distribution
  lines.push('# Score Distribution');
  const distribution = report.summary.scoreDistribution;
  lines.push(`Excellent (90-100),${distribution.excellent}`);
  lines.push(`Good (70-89),${distribution.good}`);
  lines.push(`Fair (50-69),${distribution.fair}`);
  lines.push(`Poor (0-49),${distribution.poor}`);
  lines.push('');

  // Add integrity metrics if available
  if (report.integrityMetrics) {
    lines.push('# Integrity Metrics');
    const metrics = report.integrityMetrics;
    lines.push(`Average Truth,${metrics.averageTruth}`);
    lines.push(`Average Responsibility,${metrics.averageResponsibility}`);
    lines.push(`Average Restraint,${metrics.averageRestraint}`);
    lines.push(`Average Power Risk,${metrics.averagePowerRisk}`);
    lines.push('');
  }

  // Add detailed history if available
  if (report.entries && report.entries.length > 0) {
    lines.push('# History Entries');
    const csvData = arrayToCSV(report.entries, ['timestamp', 'score', 'details']);
    lines.push(csvData.trimEnd());
  }

  return lines.join('\n');
}

/**
 * Convert user report to HTML format with basic styling
 */
export function reportToHTML(report: UserReport): string {
  const distribution = report.summary.scoreDistribution;
  const metrics = report.integrityMetrics;
  const escapeHTML = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guardian Academy Report - ${escapeHTML(report.username)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .report-container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      color: #34495e;
      margin-top: 25px;
      border-left: 4px solid #3498db;
      padding-left: 10px;
    }
    .report-header {
      background: #ecf0f1;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }
    .stat-label {
      color: #7f8c8d;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }
    .distribution-bar {
      display: flex;
      gap: 10px;
      margin: 15px 0;
    }
    .bar-item {
      flex: 1;
      background: #e8f4f8;
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }
    .bar-label {
      font-size: 12px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    .bar-count {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #34495e;
      color: white;
      font-weight: 600;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .generated-info {
      color: #7f8c8d;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <h1>Guardian Academy Report</h1>
    
    <div class="report-header">
      <p><strong>User:</strong> ${escapeHTML(report.username)}</p>
      <p><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</p>
      ${report.period ? `
        <p><strong>Period:</strong> ${report.period.startDate} to ${report.period.endDate}</p>
      ` : ''}
    </div>

    <h2>Summary Statistics</h2>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Entries</div>
        <div class="stat-value">${report.summary.totalEntries}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Score</div>
        <div class="stat-value">${report.summary.averageScore.toFixed(1)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Highest Score</div>
        <div class="stat-value">${report.summary.highestScore}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Lowest Score</div>
        <div class="stat-value">${report.summary.lowestScore}</div>
      </div>
    </div>

    <h2>Score Distribution</h2>
    <div class="distribution-bar">
      <div class="bar-item">
        <div class="bar-label">Excellent (90-100)</div>
        <div class="bar-count">${distribution.excellent}</div>
      </div>
      <div class="bar-item">
        <div class="bar-label">Good (70-89)</div>
        <div class="bar-count">${distribution.good}</div>
      </div>
      <div class="bar-item">
        <div class="bar-label">Fair (50-69)</div>
        <div class="bar-count">${distribution.fair}</div>
      </div>
      <div class="bar-item">
        <div class="bar-label">Poor (0-49)</div>
        <div class="bar-count">${distribution.poor}</div>
      </div>
    </div>

    ${metrics ? `
      <h2>Integrity Metrics</h2>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Average Truth</div>
          <div class="stat-value">${metrics.averageTruth.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Responsibility</div>
          <div class="stat-value">${metrics.averageResponsibility.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Restraint</div>
          <div class="stat-value">${metrics.averageRestraint.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Average Power Risk</div>
          <div class="stat-value">${metrics.averagePowerRisk.toFixed(2)}</div>
        </div>
      </div>
    ` : ''}

    ${report.entries && report.entries.length > 0 ? `
      <h2>History Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Score</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${report.entries.map(entry => `
            <tr>
              <td>${new Date(entry.timestamp).toLocaleString()}</td>
              <td>${entry.score}</td>
              <td>${entry.details ? escapeHTML(entry.details) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <div class="generated-info">
      <p>This report was automatically generated by Guardian Academy on ${new Date(report.generatedAt).toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Convert user report to PDF format (as a base64-encoded data URI)
 * Note: Full PDF generation would require a library like pdfkit or puppeteer
 * For now, we return HTML that can be printed to PDF
 */
export function reportToPDF(report: UserReport): string {
  // Return HTML content that can be converted to PDF by client or server
  return reportToHTML(report);
}

/**
 * Export report in the specified format
 */
export function exportReport(
  report: UserReport,
  format: ReportFormat = 'json'
): { content: string; mimeType: string; filename: string } {
  let content: string;
  let mimeType: string;
  let filename: string;

  const timestamp = new Date(report.generatedAt).toISOString().split('T')[0];
  const baseFilename = `report_${report.username}_${timestamp}`;

  switch (format) {
    case 'json':
      content = reportToJSON(report);
      mimeType = 'application/json';
      filename = `${baseFilename}.json`;
      break;

    case 'csv':
      content = reportToCSV(report);
      mimeType = 'text/csv';
      filename = `${baseFilename}.csv`;
      break;

    case 'html':
      content = reportToHTML(report);
      mimeType = 'text/html; charset=utf-8';
      filename = `${baseFilename}.html`;
      break;

    case 'pdf':
      content = reportToPDF(report);
      mimeType = 'application/pdf';
      filename = `${baseFilename}.pdf`;
      break;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  return { content, mimeType, filename };
}

/**
 * Export history entries in the specified format
 */
export function exportHistoryEntries(
  entries: HistoryEntry[],
  format: 'json' | 'csv' = 'csv'
): { content: string; mimeType: string; filename: string } {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseFilename = `history_${timestamp}`;

  if (format === 'json') {
    const content = JSON.stringify(entries, null, 2);
    return {
      content,
      mimeType: 'application/json',
      filename: `${baseFilename}.json`,
    };
  } else {
    const content = arrayToCSV(entries, ['timestamp', 'score', 'details']);
    return {
      content,
      mimeType: 'text/csv',
      filename: `${baseFilename}.csv`,
    };
  }
}
