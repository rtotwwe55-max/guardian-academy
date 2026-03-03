# Mobile Navigation Tabs Implementation

## Overview

Guardian Academy mobile app now features a comprehensive three-tab navigation system with Dashboard, Survey, and Settings screens.

## Navigation Structure

### Tab 1: Dashboard (`dashboard.tsx`)
- **Icon**: Chart Bar (📊)
- **Purpose**: Display user statistics and activity overview
- **Features**:
  - Average score display
  - Total surveys completed
  - Best score achieved
  - Daily streak tracking
  - Recent activity feed (last 5 surveys)
  - Score-based color coding
  - Refresh data button
  - Empty state when no data available

**Statistics Tracked:**
- Total number of completed surveys
- Average integrity score
- Highest score achieved
- Lowest score recorded
- Consecutive day streak

**Color Coding:**
- 🟢 Green (90-100): Excellent
- 🔵 Blue (70-89): Good
- 🟠 Orange (50-69): Fair
- 🔴 Red (0-49): Poor

### Tab 2: Survey (`survey.tsx`)
- **Icon**: Square & Pencil (✏️)
- **Purpose**: Assessment survey interface
- **Features**:
  - Integrated SurveyForm component
  - Four-point integrity rating system
  - Real-time score calculation
  - Survey history tracking
  - Instant feedback on submissions

**Survey Dimensions:**
1. Truth - Honesty and transparency
2. Responsibility - Accountability for actions
3. Restraint - Ethical boundaries and limits
4. Power Risk - Mitigation of power concentration

### Tab 3: Settings (`settings.tsx`)
- **Icon**: Gear/Settings (⚙️)
- **Purpose**: User preferences and account management
- **Features**:
  - User profile display (username, email)
  - Notification preferences
  - Dark mode indicator
  - Data export option
  - Local data management
  - App information (version, platform)
  - Logout functionality

**Settings Sections:**
1. **Profile** - Display username and email
2. **Preferences** - Notifications, dark mode
3. **Data Management** - Export and clear options
4. **About** - Version, platform, app name
5. **Logout** - Account logout with confirmation

## File Structure

```
apps/mobile/app/(tabs)/
├── _layout.tsx          (Tab navigation configuration)
├── dashboard.tsx        (NEW - Dashboard screen)
├── survey.tsx           (NEW - Survey screen)
├── settings.tsx         (NEW - Settings screen)
├── index.tsx            (UPDATED - Redirects to dashboard)
├── explore.tsx          (Kept for backwards compatibility)
├── SurveyForm.tsx       (Existing form component)
└── modal.tsx            (Existing modal)
```

## Tab Navigation Configuration

The tab navigation is configured in `_layout.tsx` with:

```typescript
<Tabs screenOptions={{
  tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
  headerShown: false,
  tabBarButton: HapticTab,
  tabBarStyle: { /* styling */ }
}}>
  <Tabs.Screen name="dashboard" ... />
  <Tabs.Screen name="survey" ... />
  <Tabs.Screen name="settings" ... />
  {/* Hidden tabs for backwards compatibility */}
  <Tabs.Screen name="index" options={{ href: null }} />
  <Tabs.Screen name="explore" options={{ href: null }} />
</Tabs>
```

## Icon Symbols Used

- `chart.bar.fill` - Dashboard (chart icon)
- `square.and.pencil` - Survey (edit icon)
- `gearshape.fill` - Settings (gear icon)

These icons use SF Symbols (iOS) and Material Icons equivalents (Android).

## Data Flow

### Dashboard Data Flow
```
Dashboard Component
  └─> Load Data (useEffect)
      ├─> Fetch username from AsyncStorage
      ├─> Fetch session token from AsyncStorage
      └─> Fetch history from API
          └─> Calculate Statistics
              ├─> Average score
              ├─> High/Low scores
              ├─> Score distribution
              └─> Streak calculation
          └─> Display in UI
                ├─> Stat cards
                └─> Recent activity list
```

### Survey Data Flow
```
Survey Component
  └─> SurveyForm
      ├─> Input: Truth, Responsibility, Restraint, PowerRisk
      ├─> Calculate: GI2 Score
      ├─> Submit to API
      └─> Update History
```

### Settings Data Flow
```
Settings Component
  ├─> Load User Data
  │   ├─> Username from AsyncStorage
  │   ├─> Email from AsyncStorage
  │   └─> Notification preference
  ├─> Toggle Notifications
  │   └─> Save to AsyncStorage
  ├─> Display System Info
  │   ├─> Current color scheme
  │   ├─> App version
  │   └─> Platform (iOS/Android)
  ├─> Data Management
  │   ├─> Export (navigate to Dashboard)
  │   └─> Clear Data (with confirmation)
  └─> Logout
      └─> Clear stored credentials
```

## Styling

All screens use consistent styling with:

- **Brand Color**: Primary tint color from theme
- **Typography**: ThemedText component for dynamic font sizing
- **Cards**: Bordered cards for statistics with left accent border
- **Spacing**: 16px horizontal padding, 24px vertical spacing
- **Border Radius**: 8-12px for rounded corners
- **Icons**: SF Symbols with dynamic coloring

### Color Scheme Support
- Light mode: White background, dark text
- Dark mode: Dark background, light text
- Automatic theme switching based on system settings

## Component Dependencies

All new screens depend on:
1. **react-native**: Core components (View, ScrollView, TouchableOpacity, Switch)
2. **expo-router**: Navigation routing
3. **@react-native-async-storage/async-storage**: Local data persistence
4. **Custom Components**:
   - `ThemedView`: Themed container component
   - `ThemedText`: Themed typography component
   - `IconSymbol`: Icon rendering component
5. **Hooks**:
   - `useColorScheme`: Dynamic theme detection

## API Integration

### Dashboard
- **GET /api/history** - Fetch user's survey history
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ history: { score, timestamp }[] }`

### Survey
- **POST /api/history** - Submit new survey
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ entry: { score, timestamp } }`

### Settings
- Uses AsyncStorage for local preferences
- No API calls required for settings

## Error Handling

### Dashboard
- `try-catch` for data loading
- Empty state when no history available
- Fallback UI for API failures

### Survey
- Form validation on client side
- API error handling
- User feedback on failed submissions

### Settings
- Confirmation dialogs for destructive actions (logout, clear data)
- Error alerts for storage operations
- Graceful degradation

## Testing

### Test Navigation
```bash
# Navigate between tabs
- Tap Dashboard tab
- Tap Survey tab
- Tap Settings tab
```

### Test Dashboard
- Load with and without survey history
- Verify statistics calculations
- Test streak calculation logic
- Verify color coding

### Test Survey
- Submit valid survey
- Verify score calculation
- Check history updates

### Test Settings
- Toggle notification preference
- Verify dark mode display
- Test logout confirmation
- Test data clear confirmation

## Future Enhancements

### Planned Features
- [ ] Custom date range filtering for dashboard
- [ ] Survey templates and presets
- [ ] Trend charts in dashboard
- [ ] Export data in multiple formats
- [ ] Scheduled survey reminders
- [ ] Social sharing of achievements
- [ ] Multi-language support
- [ ] Offline sync capabilities
- [ ] Advanced analytics
- [ ] Custom scoring rules

### UI/UX Improvements
- [ ] Pull-to-refresh gesture
- [ ] Haptic feedback on interactions
- [ ] Loading skeletons
- [ ] Animated transitions
- [ ] Gesture-based navigation
- [ ] Accessibility improvements (a11y)

### Performance Optimizations
- [ ] Memoize component renders
- [ ] Implement infinite scrolling
- [ ] Cache API responses
- [ ] Optimize re-renders
- [ ] Lazy load data

## Mobile Best Practices Implemented

✅ **Navigation**
- Tab navigation for main sections
- Clear, descriptive tab labels
- Consistent icon usage

✅ **UX Design**
- Easy-to-read typography
- Adequate touch targets (>44px)
- Color-coded feedback
- Empty states for better guidance

✅ **Performance**
- AsyncStorage for persistence
- Efficient data fetching
- ScrollView for long lists

✅ **Accessibility**
- Semantic component structure
- Clear button labels
- Color + text feedback

✅ **Data Management**
- Secure token storage
- User consent dialogs
- Data export options
- Clear feedback on actions

## Troubleshooting

### Tabs not showing
- Verify `expo-router` is properly installed
- Check that all screen files exist
- Ensure `_layout.tsx` is correctly configured

### Dashboard showing no data
- Check AsyncStorage has stored user session
- Verify API endpoint accessibility
- Check network request in logs

### Settings not saving
- Verify AsyncStorage permissions
- Check device storage is available
- Try logging out and back in

### Icons not displaying
- Ensure `@expo/vector-icons` is installed
- Check icon name spelling
- Verify platform supports SF Symbols

## Security Considerations

- ✅ Session tokens stored in AsyncStorage (secure on device)
- ✅ API requests include Authorization headers
- ✅ User consent required for data clearing
- ✅ Credentials cleared on logout
- ⚠️ AsyncStorage is not encrypted - don't store sensitive data
- ⚠️ Consider encrypted storage for production

## Accessibility Features

- Touch targets minimum 44x44 points
- Color-blindness friendly palette options
- Text scaling support
- Dark mode support
- Clear navigation hierarchy

## License

Part of Guardian Academy project - see main LICENSE file.
