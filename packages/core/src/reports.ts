import { UserReport, HistoryEntry, IntegrityScore } from './types';

/**
 * Generate score distribution statistics from a list of scores
 */
function calculateScoreDistribution(scores: number[]) {
  return {
    excellent: scores.filter(s => s >= 90).length,
    good: scores.filter(s => s >= 70 && s < 90).length,
    fair: scores.filter(s => s >= 50 && s < 70).length,
    poor: scores.filter(s => s < 50).length,
  };
}

/**
 * Calculate average integrity metrics from history entries
 */
function calculateIntegrityMetrics(entries: HistoryEntry[]) {
  const integrityEntries = entries.filter(e => e.integrityScore);

  if (integrityEntries.length === 0) {
    return undefined;
  }

  const totals = integrityEntries.reduce(
    (acc, entry) => {
      if (!entry.integrityScore) return acc;
      return {
        truth: acc.truth + entry.integrityScore.truth,
        responsibility: acc.responsibility + entry.integrityScore.responsibility,
        restraint: acc.restraint + entry.integrityScore.restraint,
        powerRisk: acc.powerRisk + entry.integrityScore.powerRisk,
      };
    },
    { truth: 0, responsibility: 0, restraint: 0, powerRisk: 0 }
  );

  const count = integrityEntries.length;

  return {
    averageTruth: Number((totals.truth / count).toFixed(2)),
    averageResponsibility: Number((totals.responsibility / count).toFixed(2)),
    averageRestraint: Number((totals.restraint / count).toFixed(2)),
    averagePowerRisk: Number((totals.powerRisk / count).toFixed(2)),
  };
}

/**
 * Calculate weekly trend from history entries
 */
function calculateWeeklyTrend(entries: HistoryEntry[]) {
  const weeklyData = new Map<string, number[]>();

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, []);
    }
    weeklyData.get(weekKey)!.push(entry.score);
  });

  return Array.from(weeklyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([week, scores]) => ({
      week,
      averageScore: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
    }));
}

/**
 * Calculate monthly trend from history entries
 */
function calculateMonthlyTrend(entries: HistoryEntry[]) {
  const monthlyData = new Map<string, number[]>();

  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, []);
    }
    monthlyData.get(monthKey)!.push(entry.score);
  });

  return Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, scores]) => ({
      month,
      averageScore: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
    }));
}

/**
 * Generate a comprehensive user report from history entries
 */
export function generateUserReport(
  username: string,
  entries: HistoryEntry[],
  options?: {
    startDate?: string;
    endDate?: string;
    includeTrends?: boolean;
    includeSummary?: boolean;
    includeEntries?: boolean;
  }
): UserReport {
  const {
    startDate,
    endDate,
    includeTrends = true,
    includeSummary = true,
    includeEntries = false,
  } = options || {};

  // Filter entries by date range if provided
  let filteredEntries = entries;
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Date.now();

    filteredEntries = entries.filter(entry => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= start && entryTime <= end;
    });
  }

  const scores = filteredEntries.map(e => e.score);
  const generatedAt = new Date().toISOString();

  let summary: UserReport['summary'] | undefined;
  if (includeSummary && scores.length > 0) {
    const averageScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    summary = {
      totalEntries: scores.length,
      averageScore,
      highestScore,
      lowestScore,
      scoreDistribution: calculateScoreDistribution(scores),
    };
  } else {
    summary = {
      totalEntries: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      scoreDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
    };
  }

  const report: UserReport = {
    username,
    generatedAt,
    ...(startDate || endDate
      ? {
          period: {
            startDate: startDate || new Date(0).toISOString().split('T')[0],
            endDate: endDate || new Date().toISOString().split('T')[0],
          },
        }
      : {}),
    summary,
  };

  // Add integrity metrics if entries have integrity scores
  const integrityMetrics = calculateIntegrityMetrics(filteredEntries);
  if (integrityMetrics) {
    report.integrityMetrics = integrityMetrics;
  }

  // Add trends if requested and we have enough data
  if (includeTrends && filteredEntries.length > 0) {
    const weeklyTrend = calculateWeeklyTrend(filteredEntries);
    const monthlyTrend = calculateMonthlyTrend(filteredEntries);

    report.trends = { weeklyTrend, monthlyTrend };
  }

  // Add entries if requested
  if (includeEntries && filteredEntries.length > 0) {
    report.entries = filteredEntries;
  }

  return report;
}

/**
 * Generate a summary report with just high-level statistics
 */
export function generateSummaryReport(
  username: string,
  entries: HistoryEntry[]
): UserReport {
  return generateUserReport(username, entries, {
    includeTrends: false,
    includeSummary: true,
    includeEntries: false,
  });
}

/**
 * Generate a detailed report with all information
 */
export function generateDetailedReport(
  username: string,
  entries: HistoryEntry[]
): UserReport {
  return generateUserReport(username, entries, {
    includeTrends: true,
    includeSummary: true,
    includeEntries: true,
  });
}

/**
 * Generate a trend-focused report
 */
export function generateTrendReport(
  username: string,
  entries: HistoryEntry[],
  startDate?: string,
  endDate?: string
): UserReport {
  return generateUserReport(username, entries, {
    startDate,
    endDate,
    includeTrends: true,
    includeSummary: true,
    includeEntries: false,
  });
}

/**
 * Generate a custom date range report
 */
export function generateCustomReport(
  username: string,
  entries: HistoryEntry[],
  startDate: string,
  endDate: string,
  options?: { includeEntries?: boolean }
): UserReport {
  return generateUserReport(username, entries, {
    startDate,
    endDate,
    includeTrends: true,
    includeSummary: true,
    includeEntries: options?.includeEntries ?? false,
  });
}
