export type IntegrityScore = {
  truth: number;
  responsibility: number;
  restraint: number;
  powerRisk: number;
};

export type HistoryEntry = {
  score: number;
  timestamp: string;
  integrityScore?: IntegrityScore;
  details?: string;
};

export type UserReport = {
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
};

export type ReportFormat = 'json' | 'csv' | 'pdf' | 'html';

export type ReportType = 'summary' | 'detailed' | 'trend' | 'custom';

export type ScheduledReport = {
  id: string;
  username: string;
  type: ReportType;
  format: ReportFormat;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeekOrMonth?: number;
  timeOfDay?: string;
  recipients: string[];
  enabled: boolean;
  lastGenerated?: string;
  nextScheduled?: string;
  createdAt: string;
};
