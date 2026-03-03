# Export and Scheduled Reports Guide

## Overview

Guardian Academy now includes comprehensive export and scheduled reporting capabilities:

1. **Export Endpoints** - Export user data in multiple formats
2. **Report Generation** - Generate summaries, detailed, and trend reports
3. **Scheduled Reports** - Automatically generate and email reports on a schedule

## Export Endpoints

### Export User Data

**Endpoint:** `GET /api/export`

Export user history and reports in multiple formats.

**Query Parameters:**
- `format` (optional): Export format - `csv` | `json` | `html` | `pdf` (default: `csv`)
- `reportType` (optional): Report type - `summary` | `detailed` (default: `summary`)
- `startDate` (optional): ISO date string for report start
- `endDate` (optional): ISO date string for report end

**Authentication:** Requires Bearer token

**Example:**
```bash
# Export CSV summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/export?format=csv&reportType=summary"

# Export detailed HTML report for a date range
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/export?format=html&reportType=detailed&startDate=2025-01-01&endDate=2025-12-31"
```

**Response:**
- `format=csv|json|html|pdf`: File attachment with report content
- `format=pdf`: Returns HTML content (use client-side print-to-PDF or integrate puppeteer)

### Save Report

**Endpoint:** `POST /api/export`

Generate and save a report to the database for future reference.

**Request Body:**
```json
{
  "reportType": "summary" | "detailed",
  "startDate": "2025-01-01" (optional),
  "endDate": "2025-12-31" (optional),
  "notes": "Custom notes" (optional)
}
```

**Response:**
```json
{
  "reportId": "generated_report_id",
  "report": { /* UserReport object */ }
}
```

## Report Generation

### Report Types

1. **Summary Report**
   - Total entries, average/high/low scores
   - Score distribution (excellent/good/fair/poor)
   - Generated quickly

2. **Detailed Report**
   - All summary statistics
   - Weekly and monthly trends
   - Full history entries
   - Integrity metrics if available

3. **Trend Report**
   - Week-over-week and month-over-month trends
   - Date range support
   - Good for analyzing progress

4. **Custom Report**
   - Date range filtering
   - Selectable metrics
   - Flexible date ranges

### Report Formats

- **JSON**: Machine-readable, programmatic use
- **CSV**: Spreadsheet compatible, easy analysis
- **HTML**: Styled, human-readable, printable
- **PDF**: Use client-side printing or integrate puppeteer server-side

## Saved Reports

### Get All Saved Reports

**Endpoint:** `GET /api/reports`

Retrieve all previously saved reports.

**Response:**
```json
{
  "reports": [
    {
      "id": "report_id",
      "report": { /* UserReport object */ },
      "createdAt": "2025-03-02T10:30:00Z"
    }
  ]
}
```

### Get Specific Report

**Endpoint:** `GET /api/reports/[id]`

Retrieve a specific saved report by ID.

**Response:**
```json
{
  "report": { /* UserReport object */ }
}
```

## Scheduled Reports

### Create Scheduled Report

**Endpoint:** `POST /api/reports/scheduled`

Set up automatic report generation and email delivery.

**Request Body:**
```json
{
  "type": "summary" | "detailed" | "trend" | "custom",
  "format": "json" | "csv" | "pdf" | "html",
  "frequency": "daily" | "weekly" | "monthly",
  "dayOfWeekOrMonth": 1 (optional, 0-6 for week, 1-31 for month),
  "timeOfDay": "09:00" (optional, HH:MM format, default 09:00),
  "recipients": ["email@example.com"],
  "enabled": true
}
```

**Frequency Examples:**
- Daily: Generates every day at specified time
- Weekly: Generates on specified day (0=Sunday, 6=Saturday)
- Monthly: Generates on specified date (1-31)

**Response:**
```json
{
  "id": "scheduled_report_id",
  "report": { /* ScheduledReport object */ }
}
```

**Example:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "summary",
    "format": "html",
    "frequency": "weekly",
    "dayOfWeekOrMonth": 1,
    "timeOfDay": "09:00",
    "recipients": ["user@example.com"],
    "enabled": true
  }' \
  http://localhost:3000/api/reports/scheduled
```

### Get Scheduled Reports

**Endpoint:** `GET /api/reports/scheduled`

List all scheduled reports for the user.

**Response:**
```json
{
  "reports": [
    {
      "id": "report_id",
      "username": "user",
      "type": "summary",
      "format": "html",
      "frequency": "weekly",
      "dayOfWeekOrMonth": 1,
      "timeOfDay": "09:00",
      "recipients": ["email@example.com"],
      "enabled": true,
      "lastGenerated": "2025-03-02T09:15:00Z",
      "nextScheduled": "2025-03-09T09:00:00Z",
      "createdAt": "2025-02-28T10:30:00Z"
    }
  ]
}
```

### Update Scheduled Report

**Endpoint:** `PUT /api/reports/scheduled/[id]`

Modify an existing scheduled report.

**Request Body:** (any field to update)
```json
{
  "enabled": false,
  "recipients": ["newemail@example.com"],
  "frequency": "monthly"
}
```

### Delete Scheduled Report

**Endpoint:** `DELETE /api/reports/scheduled/[id]`

Remove a scheduled report.

## Cron Job Setup

Scheduled reports are processed by a cron job handler. Set up automated execution using one of:

### 1. EasyCron (Free web-based cron service)

1. Go to https://www.easycron.com/
2. Create new cron job
3. URL: `https://yourdomain.com/api/cron/process-reports`
4. Request type: POST
5. Custom headers:
   ```
   x-cron-secret: YOUR_CRON_SECRET
   ```
6. Set execution frequency (e.g., every hour)

### 2. AWS EventBridge

```typescript
// Create EventBridge rule to trigger Lambda that calls your endpoint
const rule = new events.Rule(stack, 'ProcessReportsRule', {
  schedule: events.Schedule.rate(Duration.hours(1)),
});

rule.addTarget(
  new targets.HttpApi(reportApi, {
    pathParameterValues: [],
    headerParameters: {
      'x-cron-secret': process.env.CRON_SECRET,
    },
  })
);
```

### 3. GitHub Actions

Create `.github/workflows/scheduled-reports.yml`:
```yaml
name: Process Scheduled Reports

on:
  schedule:
    - cron: '0 * * * *'  # Every hour

jobs:
  process-reports:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Report Processing
        run: |
          curl -X POST \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            ${{ secrets.APP_URL }}/api/cron/process-reports
```

### 4. Railway Cron

Configuration in `railway.json`:
```json
{
  "jobs": [
    {
      "name": "process-reports",
      "command": "curl -X POST -H 'x-cron-secret: $CRON_SECRET' $APP_URL/api/cron/process-reports",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Environment Variables

Add these to your `.env.local`:

```env
# Cron job authentication
CRON_SECRET=your-secret-cron-key

# Email service (SendGrid example)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@guardian-academy.com

# For development/testing
EMAIL_SERVICE=mock
```

## Email Service Integration

The system includes a placeholder email service. To enable actual email sending:

### SendGrid Integration

1. Install SendGrid:
   ```bash
   npm install @sendgrid/mail
   ```

2. Add API key to environment:
   ```env
   SENDGRID_API_KEY=your-api-key
   ```

3. Update `src/lib/email.ts` to use SendGrid client

### Custom Email Provider

Update the `sendEmail` function in `src/lib/email.ts`:

```typescript
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Your email provider implementation
  // Return true on success, false on failure
}
```

## Report Data Structure

### UserReport

```typescript
{
  username: string;
  generatedAt: string;
  period?: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalEntries: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
    };
  };
  integrityMetrics?: {
    averageTruth: number;
    averageResponsibility: number;
    averageRestraint: number;
    averagePowerRisk: number;
  };
  trends?: {
    weeklyTrend: Array<{ week: string; averageScore: number }>;
    monthlyTrend: Array<{ month: string; averageScore: number }>;
  };
  entries?: HistoryEntry[];
}
```

## Client-Side Usage Examples

### Generate and Download Report

```typescript
async function downloadReport(format: 'csv' | 'json' | 'html') {
  const response = await fetch(
    `/api/export?format=${format}&reportType=detailed`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Create Scheduled Report

```typescript
async function createScheduledReport() {
  const response = await fetch('/api/reports/scheduled', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'summary',
      format: 'html',
      frequency: 'weekly',
      dayOfWeekOrMonth: 1,
      timeOfDay: '09:00',
      recipients: ['user@example.com'],
      enabled: true,
    }),
  });

  const { id, report } = await response.json();
  console.log('Scheduled report created:', id);
}
```

### View Saved Reports

```typescript
async function loadSavedReports() {
  const response = await fetch('/api/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { reports } = await response.json();
  return reports;
}
```

## Troubleshooting

### Reports not being generated

1. Check cron job is configured correctly
2. Verify `CRON_SECRET` matches between environment and cron call
3. Check server logs for errors in `api/cron/process-reports`
4. Ensure scheduled report has `enabled: true`

### Emails not being sent

1. Verify email service is configured (SendGrid, etc.)
2. Check SENDGRID_API_KEY is set
3. Verify recipient email addresses are valid
4. Check server logs for email errors
5. Test with `EMAIL_SERVICE=mock` in development

### Reports missing data

1. Ensure user has history entries
2. Check date range filters are correct
3. Verify report type supports requested metrics
4. Check for Firebase/database connectivity issues

## Best Practices

1. **Frequency**: Don't schedule reports too frequently (minimum hourly recommended)
2. **Recipients**: Validate email addresses before saving scheduled reports
3. **Date Ranges**: Use ISO format (YYYY-MM-DD) for date filtering
4. **Export Size**: Large datasets (>10k entries) may be slow to export, consider filtered date ranges
5. **Storage**: Regularly clean up old saved reports to manage database size
6. **Security**: Always require authentication for export and report endpoints
