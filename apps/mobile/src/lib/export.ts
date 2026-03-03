import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Export service for downloading reports and CSV data
 */

const API_BASE_URL = 'http://localhost:3000';

export interface ExportOptions {
  format?: 'csv' | 'json' | 'html';
  reportType?: 'summary' | 'detailed';
  startDate?: string;
  endDate?: string;
}

/**
 * Get the user's session token from AsyncStorage
 */
async function getSessionToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('session');
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
}

/**
 * Download CSV export from API
 */
export async function exportAsCSV(options?: ExportOptions): Promise<boolean> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    // Build query parameters
    const params = new URLSearchParams({
      format: options?.format || 'csv',
      reportType: options?.reportType || 'summary',
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/csv',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Get the filename from Content-Disposition header or use default
    let filename = 'export.csv';
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]*)"?/);
      if (match) filename = match[1];
    }

    // Get CSV data as text
    const csvData = await response.text();

    // Save to file and share
    return await saveAndShareFile(csvData, filename, 'text/csv');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}

/**
 * Download JSON export from API
 */
export async function exportAsJSON(options?: ExportOptions): Promise<boolean> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    const params = new URLSearchParams({
      format: 'json',
      reportType: options?.reportType || 'summary',
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    let filename = 'export.json';
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]*)"?/);
      if (match) filename = match[1];
    }

    const jsonData = await response.json();

    return await saveAndShareFile(JSON.stringify(jsonData, null, 2), filename, 'application/json');
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
}

/**
 * Download HTML report from API
 */
export async function exportAsHTML(options?: ExportOptions): Promise<boolean> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    const params = new URLSearchParams({
      format: 'html',
      reportType: options?.reportType || 'detailed',
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    let filename = 'report.html';
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]*)"?/);
      if (match) filename = match[1];
    }

    const htmlData = await response.text();

    return await saveAndShareFile(htmlData, filename, 'text/html');
  } catch (error) {
    console.error('Error exporting HTML:', error);
    throw error;
  }
}

/**
 * Save file and present sharing options
 */
async function saveAndShareFile(
  content: string,
  filename: string,
  mimeType: string
): Promise<boolean> {
  try {
    // Generate file path in app's cache directory
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    // Write file to cache directory
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available
    const sharingAvailable = await Sharing.isAvailableAsync();

    if (sharingAvailable) {
      // Present sharing dialog
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `Export ${filename}`,
      });
      return true;
    } else {
      // Fallback: just log the file path
      console.log(`File saved to: ${fileUri}`);
      return true;
    }
  } catch (error) {
    console.error('Error saving/sharing file:', error);
    throw error;
  }
}

/**
 * Export summary report and return data
 */
export async function exportSummaryReport(options?: Omit<ExportOptions, 'format'>): Promise<any> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    const params = new URLSearchParams({
      format: 'json',
      reportType: 'summary',
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exporting summary report:', error);
    throw error;
  }
}

/**
 * Export detailed report and return data
 */
export async function exportDetailedReport(
  options?: Omit<ExportOptions, 'format'>
): Promise<any> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    const params = new URLSearchParams({
      format: 'json',
      reportType: 'detailed',
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exporting detailed report:', error);
    throw error;
  }
}

/**
 * Save report to backend database
 */
export async function saveReportToBackend(reportType: 'summary' | 'detailed'): Promise<string> {
  try {
    const token = await getSessionToken();
    if (!token) {
      throw new Error('No session token found. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/api/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportType,
        notes: `Generated on ${new Date().toLocaleString()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.reportId;
  } catch (error) {
    console.error('Error saving report to backend:', error);
    throw error;
  }
}

export default {
  exportAsCSV,
  exportAsJSON,
  exportAsHTML,
  exportSummaryReport,
  exportDetailedReport,
  saveReportToBackend,
};
