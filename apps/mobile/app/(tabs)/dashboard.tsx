import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exportAsCSV, exportAsJSON, exportAsHTML } from '@/lib/export';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState<string>('');
  const [history, setHistory] = useState<{ score: number; timestamp: string }[]>([]);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalScores: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    streak: 0,
  });

  const loadDashboardData = useCallback(async () => {
    try {
      const u = await AsyncStorage.getItem('username');
      const session = await AsyncStorage.getItem('session');

      if (u) {
        setUsername(u);
      }

      if (session) {
        // Fetch history from API
        const res = await fetch(`http://localhost:3000/api/history`, {
          headers: {
            'Authorization': `Bearer ${session}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const scores = data.history || [];
          setHistory(scores);
          calculateStats(scores);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const calculateStats = (scores: { score: number; timestamp: string }[]) => {
    if (scores.length === 0) {
      setStats({
        totalScores: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        streak: 0,
      });
      return;
    }

    const scoreValues = scores.map(s => s.score);
    const average = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
    const highest = Math.max(...scoreValues);
    const lowest = Math.min(...scoreValues);

    // Calculate streak (consecutive days)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < scores.length; i++) {
      const scoreDate = new Date(scores[i].timestamp);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (
        scoreDate.getFullYear() === expectedDate.getFullYear() &&
        scoreDate.getMonth() === expectedDate.getMonth() &&
        scoreDate.getDate() === expectedDate.getDate()
      ) {
        streak++;
      } else {
        break;
      }
    }

    setStats({
      totalScores: scores.length,
      averageScore: average,
      highestScore: highest,
      lowestScore: lowest,
      streak,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50'; // Green - Excellent
    if (score >= 70) return '#2196F3'; // Blue - Good
    if (score >= 50) return '#FF9800'; // Orange - Fair
    return '#F44336'; // Red - Poor
  };

  const refreshData = async () => {
    await loadDashboardData();
  };

  const handleExport = () => {
    Alert.alert('Export Survey Data', 'Choose export format:', [
      { text: 'CSV', onPress: () => performExport('csv') },
      { text: 'JSON', onPress: () => performExport('json') },
      { text: 'HTML Report', onPress: () => performExport('html') },
      { text: 'Cancel', onPress: () => {}, style: 'cancel' }
    ]);
  };

  const performExport = async (format: 'csv' | 'json' | 'html') => {
    try {
      setExporting(true);
      
      if (format === 'csv') {
        await exportAsCSV({ username });
      } else if (format === 'json') {
        await exportAsJSON({ username });
      } else if (format === 'html') {
        await exportAsHTML({ username });
      }
      
      Alert.alert('Success', 'Survey data exported successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      Alert.alert('Export Error', errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Dashboard
        </ThemedText>
        <ThemedText type="subtitle" style={styles.greeting}>
          Welcome back, {username || 'User'}!
        </ThemedText>
      </ThemedView>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        {/* Average Score Card */}
        <View style={[styles.statCard, { borderLeftColor: getScoreColor(stats.averageScore) }]}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            Average Score
          </ThemedText>
          <ThemedText
            type="title"
            style={[styles.statValue, { color: getScoreColor(stats.averageScore) }]}>
            {stats.averageScore}
          </ThemedText>
        </View>

        {/* Total Scores Card */}
        <View style={[styles.statCard, { borderLeftColor: '#3f51b5' }]}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            Total Surveys
          </ThemedText>
          <ThemedText type="title" style={[styles.statValue, { color: '#3f51b5' }]}>
            {stats.totalScores}
          </ThemedText>
        </View>

        {/* Best Score Card */}
        <View style={[styles.statCard, { borderLeftColor: '#4CAF50' }]}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            Best Score
          </ThemedText>
          <ThemedText type="title" style={[styles.statValue, { color: '#4CAF50' }]}>
            {stats.highestScore}
          </ThemedText>
        </View>

        {/* Streak Card */}
        <View style={[styles.statCard, { borderLeftColor: '#FF6F00' }]}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            Day Streak
          </ThemedText>
          <ThemedText type="title" style={[styles.statValue, { color: '#FF6F00' }]}>
            {stats.streak}
          </ThemedText>
        </View>
      </View>

      {/* Recent Activity */}
      {history.length > 0 && (
        <ThemedView style={styles.recentSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Activity
          </ThemedText>
          <View style={styles.recentList}>
            {history.slice(0, 5).map((item, index) => {
              const date = new Date(item.timestamp);
              const dateStr = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              return (
                <View key={index} style={styles.recentItem}>
                  <View style={styles.recentLeft}>
                    <ThemedText type="default" style={styles.recentDate}>
                      {dateStr}
                    </ThemedText>
                  </View>
                  <View style={styles.recentRight}>
                    <View
                      style={[
                        styles.scoreIndicator,
                        { backgroundColor: getScoreColor(item.score) },
                      ]}>
                      <ThemedText
                        style={[styles.scoreText, { color: '#fff' }]}>
                        {item.score}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ThemedView>
      )}

      {/* Refresh Button */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={refreshData}>
          <ThemedText style={styles.actionButtonText}>Refresh Data</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            exporting && styles.actionButtonDisabled
          ]}
          onPress={handleExport}
          disabled={exporting}>
          {exporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
              <ThemedText style={styles.actionButtonText}>Exporting...</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.actionButtonText}>Export Data</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {history.length === 0 && (
        <ThemedView style={styles.emptyState}>
          <ThemedText type="defaultSemiBold" style={styles.emptyStateTitle}>
            No data yet
          </ThemedText>
          <ThemedText type="default" style={styles.emptyStateText}>
            Complete your first survey to see your dashboard statistics.
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  recentSection: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentLeft: {
    flex: 1,
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentDate: {
    fontSize: 13,
  },
  scoreIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  refreshButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
