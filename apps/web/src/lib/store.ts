import { arrayToCSV, generateUserReport, generateSummaryReport, generateDetailedReport } from 'core';
import type { UserReport, HistoryEntry, ScheduledReport } from 'core';
import { db } from '../../firebaseAdmin';

interface Entry {
  score: number;
  timestamp: string;
}

interface UserData {
  history: Entry[];
}

// in-memory fallback
const userHistory = new Map<string, Entry[]>();
const scheduledReports = new Map<string, ScheduledReport[]>();

const historyCollection = db ? db.collection('userHistory') : null;
const reportsCollection = db ? db.collection('reports') : null;
const scheduledReportsCollection = db ? db.collection('scheduledReports') : null;

export async function getHistory(username: string): Promise<Entry[] | null> {
  if (db && historyCollection) {
    const doc = await historyCollection.doc(username).get();
    if (!doc.exists) return [];
    const data = doc.data() as UserData;
    return data.history || [];
  } else {
    return userHistory.get(username) || [];
  }
}

export async function addHistory(username: string, entry: Entry): Promise<Entry[] | null> {
  if (db && historyCollection) {
    const docRef = historyCollection.doc(username);
    const doc = await docRef.get();
    const data = (doc.exists ? doc.data() : { history: [] }) as UserData;
    const newHistory = [...(data.history || []), entry];
    await docRef.set({ history: newHistory });
    return newHistory;
  } else {
    const current = userHistory.get(username) || [];
    const newHistory = [...current, entry];
    userHistory.set(username, newHistory);
    return newHistory;
  }
}

export async function clearHistory(username: string): Promise<boolean> {
  if (db && historyCollection) {
    await historyCollection.doc(username).set({ history: [] });
    return true;
  } else {
    userHistory.set(username, []);
    return true;
  }
}

export async function exportCSV(username: string): Promise<string | null> {
  const h = await getHistory(username);
  if (!h || h.length === 0) return null;
  return arrayToCSV(h, ['timestamp', 'score']);
}

/**
 * Generate a user report
 */
export async function generateReport(
  username: string,
  reportType: 'summary' | 'detailed' = 'summary',
  options?: { startDate?: string; endDate?: string }
): Promise<UserReport | null> {
  const h = await getHistory(username);
  if (!h || h.length === 0) return null;

  // Convert to HistoryEntry format
  const entries: HistoryEntry[] = h.map(e => ({
    score: e.score,
    timestamp: e.timestamp,
  }));

  if (reportType === 'summary') {
    return generateSummaryReport(username, entries);
  } else {
    return generateUserReport(username, entries, {
      startDate: options?.startDate,
      endDate: options?.endDate,
      includeTrends: true,
      includeSummary: true,
      includeEntries: true,
    });
  }
}

/**
 * Save a generated report to database
 */
export async function saveReport(
  username: string,
  report: UserReport,
  metadata?: { format?: string; notes?: string }
): Promise<string | null> {
  if (!db || !reportsCollection) {
    // In-memory storage not implemented for reports, return report ID
    return `report_${Date.now()}`;
  }

  try {
    const reportId = `${username}_${Date.now()}`;
    await reportsCollection.doc(reportId).set({
      username,
      report,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    });
    return reportId;
  } catch (error) {
    console.error('Error saving report:', error);
    return null;
  }
}

/**
 * Get a saved report
 */
export async function getSavedReport(reportId: string): Promise<UserReport | null> {
  if (!db || !reportsCollection) {
    return null;
  }

  try {
    const doc = await reportsCollection.doc(reportId).get();
    if (!doc.exists) return null;
    const data = doc.data() as { report: UserReport };
    return data.report;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}

/**
 * Get all saved reports for a user
 */
export async function getUserReports(username: string): Promise<Array<{ id: string; report: UserReport; createdAt: string }>> {
  if (!db || !reportsCollection) {
    return [];
  }

  try {
    const snapshot = await reportsCollection.where('username', '==', username).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      report: (doc.data() as any).report,
      createdAt: (doc.data() as any).createdAt,
    }));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
}

/**
 * Create a scheduled report
 */
export async function createScheduledReport(
  report: ScheduledReport
): Promise<string | null> {
  if (db && scheduledReportsCollection) {
    try {
      const docRef = await scheduledReportsCollection.add(report);
      return docRef.id;
    } catch (error) {
      console.error('Error creating scheduled report:', error);
      return null;
    }
  } else {
    // In-memory storage
    const reports = scheduledReports.get(report.username) || [];
    const id = `scheduled_${Date.now()}`;
    reports.push({ ...report, id });
    scheduledReports.set(report.username, reports);
    return id;
  }
}

/**
 * Get scheduled reports for a user
 */
export async function getUserScheduledReports(username: string): Promise<ScheduledReport[]> {
  if (db && scheduledReportsCollection) {
    try {
      const snapshot = await scheduledReportsCollection
        .where('username', '==', username)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => doc.data() as ScheduledReport);
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      return [];
    }
  } else {
    return scheduledReports.get(username) || [];
  }
}

/**
 * Update a scheduled report
 */
export async function updateScheduledReport(
  reportId: string,
  updates: Partial<ScheduledReport>
): Promise<boolean> {
  if (db && scheduledReportsCollection) {
    try {
      await scheduledReportsCollection.doc(reportId).update(updates);
      return true;
    } catch (error) {
      console.error('Error updating scheduled report:', error);
      return false;
    }
  } else {
    // In-memory update not fully implemented, return false
    return false;
  }
}

/**
 * Delete a scheduled report
 */
export async function deleteScheduledReport(reportId: string): Promise<boolean> {
  if (db && scheduledReportsCollection) {
    try {
      await scheduledReportsCollection.doc(reportId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      return false;
    }
  } else {
    // In-memory delete not fully implemented
    return false;
  }
}

/**
 * Get all scheduled reports across all users (for cron job)
 */
export async function getAllScheduledReports(): Promise<ScheduledReport[]> {
  if (db && scheduledReportsCollection) {
    try {
      const snapshot = await scheduledReportsCollection.where('enabled', '==', true).get();
      return snapshot.docs.map(doc => doc.data() as ScheduledReport);
    } catch (error) {
      console.error('Error fetching all scheduled reports:', error);
      return [];
    }
  } else {
    // Return all in-memory scheduled reports
    const allReports: ScheduledReport[] = [];
    scheduledReports.forEach(reports => {
      allReports.push(...reports.filter(r => r.enabled));
    });
    return allReports;
  }
}
