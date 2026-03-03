import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { exportAsCSV, exportAsJSON, exportAsHTML } from '@/lib/export';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notifications, setNotifications] = useState(true);
  const [appVersion] = useState('1.0.0');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedNotifications = await AsyncStorage.getItem('notifications');

      if (storedUsername) setUsername(storedUsername);
      if (storedEmail) setEmail(storedEmail);
      if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(value));
    } catch (err) {
      console.error('Error saving notifications setting:', err);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('session');
              await AsyncStorage.removeItem('username');
              await AsyncStorage.removeItem('email');
              // Navigation back to login would be handled by your app's navigation
              Alert.alert('Logged out successfully');
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExport = async () => {
    Alert.alert(
      'Export Survey Data',
      'Choose export format:',
      [
        {
          text: 'CSV',
          onPress: async () => {
            await performExport('csv');
          },
        },
        {
          text: 'JSON',
          onPress: async () => {
            await performExport('json');
          },
        },
        {
          text: 'HTML Report',
          onPress: async () => {
            await performExport('html');
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ]
    );
  };

  const performExport = async (format: 'csv' | 'json' | 'html') => {
    try {
      setExporting(true);

      let success = false;
      if (format === 'csv') {
        success = await exportAsCSV({ format: 'csv', reportType: 'summary' });
      } else if (format === 'json') {
        success = await exportAsJSON({ format: 'json', reportType: 'summary' });
      } else if (format === 'html') {
        success = await exportAsHTML({ format: 'html', reportType: 'detailed' });
      }

      if (success) {
        Alert.alert('Success', `Data exported as ${format.toUpperCase()} successfully`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      Alert.alert('Export Error', errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear all your local survey data. This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('history');
              Alert.alert('Data cleared successfully');
            } catch (err) {
              console.error('Clear data error:', err);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
      </ThemedView>

      {/* Profile Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Profile
        </ThemedText>

        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <ThemedText type="default" style={styles.settingLabelText}>
              Username
            </ThemedText>
          </View>
          <ThemedText type="default" style={styles.settingValue}>
            {username || 'Not set'}
          </ThemedText>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <ThemedText type="default" style={styles.settingLabelText}>
              Email
            </ThemedText>
          </View>
          <ThemedText type="default" style={styles.settingValue}>
            {email || 'Not set'}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Preferences Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Preferences
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <ThemedText type="default" style={styles.settingLabelText}>
              Notifications
            </ThemedText>
            <ThemedText type="default" style={styles.settingDescription}>
              Receive survey reminders
            </ThemedText>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#767577', true: '#81c784' }}
            thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: '#f0f0f0' }]}>
          <View style={styles.settingLabel}>
            <ThemedText type="default" style={styles.settingLabelText}>
              Dark Mode
            </ThemedText>
            <ThemedText type="default" style={styles.settingDescription}>
              {colorScheme === 'dark' ? 'Enabled' : 'Disabled'}
            </ThemedText>
          </View>
          <ThemedText type="default" style={styles.settingValue}>
            {colorScheme === 'dark' ? '🌙' : '☀️'}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Data Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Data Management
        </ThemedText>

        <TouchableOpacity
          style={[styles.actionButton, exporting && styles.actionButtonDisabled]}
          onPress={handleExport}
          disabled={exporting}>
          <View style={styles.actionButtonContent}>
            {exporting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0a7ea4" />
                <ThemedText type="default" style={[styles.actionButtonText, { marginLeft: 8 }]}>
                  Exporting...
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="default" style={styles.actionButtonText}>
                Export Survey Data
              </ThemedText>
            )}
          </View>
          {!exporting && <ThemedText style={{ fontSize: 16 }}>→</ThemedText>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
          <View style={styles.actionButtonContent}>
            <ThemedText type="default" style={[styles.actionButtonText, { color: '#f44336' }]}>
              Clear Local Data
            </ThemedText>
          </View>
          <ThemedText style={{ fontSize: 16, color: '#f44336' }}>→</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* About Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          About
        </ThemedText>

        <View style={styles.settingItem}>
          <ThemedText type="default" style={styles.settingLabelText}>
            App Version
          </ThemedText>
          <ThemedText type="default" style={styles.settingValue}>
            {appVersion}
          </ThemedText>
        </View>

        <View style={styles.settingItem}>
          <ThemedText type="default" style={styles.settingLabelText}>
            Platform
          </ThemedText>
          <ThemedText type="default" style={styles.settingValue}>
            {Platform.OS === 'ios' ? 'iOS' : 'Android'}
          </ThemedText>
        </View>

        <View style={styles.settingItem}>
          <ThemedText type="default" style={styles.settingLabelText}>
            App Name
          </ThemedText>
          <ThemedText type="default" style={styles.settingValue}>
            Guardian Academy
          </ThemedText>
        </View>
      </ThemedView>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { marginTop: 24 }]}
        onPress={handleLogout}>
        <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
      </TouchableOpacity>

      {/* Footer Note */}
      <ThemedView style={styles.footer}>
        <ThemedText type="default" style={styles.footerText}>
          Guardian Academy helps you assess governance integrity through systematic evaluation.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
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
  },
  section: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 12,
    marginTop: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  settingItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    flex: 1,
  },
  settingLabelText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 13,
    opacity: 0.6,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});
