/**
 * Example: Client-Side Integration for Export and Reports
 * 
 * This file demonstrates how to use the export and scheduled reports APIs
 * from your frontend application.
 */

// ============================================
// 1. EXPORT AND DOWNLOAD REPORT
// ============================================

export async function downloadReport(
  token: string,
  format: 'csv' | 'json' | 'html' | 'pdf',
  reportType: 'summary' | 'detailed' = 'summary',
  startDate?: string,
  endDate?: string
): Promise<void> {
  try {
    const params = new URLSearchParams({
      format,
      reportType,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await fetch(`/api/export?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    // Determine filename from headers or use default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `report.${format}`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]*)"?/);
      if (match) filename = match[1];
    }

    // Create blob and download
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
}

// ============================================
// 2. SAVE REPORT TO DATABASE
// ============================================

export async function saveReport(
  token: string,
  reportType: 'summary' | 'detailed' = 'summary',
  startDate?: string,
  endDate?: string,
  notes?: string
): Promise<{ reportId: string; report: any }> {
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reportType,
      startDate,
      endDate,
      notes,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save report: ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// 3. GET ALL SAVED REPORTS
// ============================================

export async function getSavedReports(token: string): Promise<any[]> {
  const response = await fetch('/api/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.statusText}`);
  }

  const { reports } = await response.json();
  return reports;
}

// ============================================
// 4. GET SPECIFIC SAVED REPORT
// ============================================

export async function getSavedReport(token: string, reportId: string): Promise<any> {
  const response = await fetch(`/api/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.statusText}`);
  }

  const { report } = await response.json();
  return report;
}

// ============================================
// 5. CREATE SCHEDULED REPORT
// ============================================

export interface CreateScheduledReportRequest {
  type: 'summary' | 'detailed' | 'trend' | 'custom';
  format: 'json' | 'csv' | 'pdf' | 'html';
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeekOrMonth?: number;
  timeOfDay?: string;
  recipients: string[];
  enabled?: boolean;
}

export async function createScheduledReport(
  token: string,
  config: CreateScheduledReportRequest
): Promise<{ id: string; report: any }> {
  const response = await fetch('/api/reports/scheduled', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error(`Failed to create scheduled report: ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// 6. GET SCHEDULED REPORTS
// ============================================

export async function getScheduledReports(token: string): Promise<any[]> {
  const response = await fetch('/api/reports/scheduled', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch scheduled reports: ${response.statusText}`);
  }

  const { reports } = await response.json();
  return reports;
}

// ============================================
// 7. UPDATE SCHEDULED REPORT
// ============================================

export async function updateScheduledReport(
  token: string,
  reportId: string,
  updates: Partial<CreateScheduledReportRequest & { enabled: boolean }>
): Promise<void> {
  const response = await fetch(`/api/reports/scheduled/${reportId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update scheduled report: ${response.statusText}`);
  }
}

// ============================================
// 8. DELETE SCHEDULED REPORT
// ============================================

export async function deleteScheduledReport(token: string, reportId: string): Promise<void> {
  const response = await fetch(`/api/reports/scheduled/${reportId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete scheduled report: ${response.statusText}`);
  }
}

// ============================================
// EXAMPLE USAGE IN COMPONENTS
// ============================================

// Example: Report generation component
export async function ExampleUsage(token: string) {
  try {
    // 1. Download a CSV export
    console.log('Downloading CSV report...');
    await downloadReport(token, 'csv', 'summary');

    // 2. Save a detailed report for later
    console.log('Saving detailed report...');
    const { reportId, report } = await saveReport(token, 'detailed');
    console.log('Report saved with ID:', reportId);

    // 3. Create a weekly scheduled report
    console.log('Creating weekly scheduled report...');
    const scheduled = await createScheduledReport(token, {
      type: 'summary',
      format: 'html',
      frequency: 'weekly',
      dayOfWeekOrMonth: 1, // Monday
      timeOfDay: '09:00',
      recipients: ['user@example.com'],
      enabled: true,
    });
    console.log('Scheduled report ID:', scheduled.id);

    // 4. Get all scheduled reports
    console.log('Fetching scheduled reports...');
    const schedules = await getScheduledReports(token);
    console.log('Found', schedules.length, 'scheduled reports');

    // 5. Update a scheduled report
    console.log('Updating scheduled report...');
    await updateScheduledReport(token, scheduled.id, {
      enabled: false,
    });

    // 6. Get all saved reports
    console.log('Fetching saved reports...');
    const saved = await getSavedReports(token);
    console.log('Found', saved.length, 'saved reports');

    // 7. Get a specific report
    if (saved.length > 0) {
      console.log('Fetching specific report...');
      const detail = await getSavedReport(token, saved[0].id);
      console.log('Report summary:', detail.summary);
    }
  } catch (error) {
    console.error('Example error:', error);
  }
}

// ============================================
// REACT HOOK EXAMPLE
// ============================================

export function useReportAPI(token: string) {
  const [reports, setReports] = React.useState<any[]>([]);
  const [scheduledReports, setScheduledReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadReports = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [saved, scheduled] = await Promise.all([
        getSavedReports(token),
        getScheduledReports(token),
      ]);
      setReports(saved);
      setScheduledReports(scheduled);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reports');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createSchedule = React.useCallback(
    async (config: CreateScheduledReportRequest) => {
      try {
        setLoading(true);
        const result = await createScheduledReport(token, config);
        await loadReports(); // Refresh list
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating schedule');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, loadReports]
  );

  const deleteSchedule = React.useCallback(
    async (reportId: string) => {
      try {
        setLoading(true);
        await deleteScheduledReport(token, reportId);
        await loadReports(); // Refresh list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting schedule');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, loadReports]
  );

  const downloadCSV = React.useCallback(
    async (reportType: 'summary' | 'detailed' = 'summary') => {
      try {
        setLoading(true);
        await downloadReport(token, 'csv', reportType);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error downloading report');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  React.useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    scheduledReports,
    loading,
    error,
    loadReports,
    createSchedule,
    deleteSchedule,
    downloadCSV,
    downloadReport: (format: 'csv' | 'json' | 'html' | 'pdf') =>
      downloadReport(token, format),
  };
}

// Import React (assuming it's available)
import * as React from 'react';

export default {
  downloadReport,
  saveReport,
  getSavedReports,
  getSavedReport,
  createScheduledReport,
  getScheduledReports,
  updateScheduledReport,
  deleteScheduledReport,
  useReportAPI,
};