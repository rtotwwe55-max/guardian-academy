import { Redirect } from 'expo-router';

/**
 * Redirect to dashboard
 * The actual home screen is now the Dashboard tab
 */
export default function HomeScreen() {
  return <Redirect href="/(tabs)/dashboard" />;
}
