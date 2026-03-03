# Mobile Navigation Tabs - Quick Start Guide

## What's New

The Guardian Academy mobile app now features three main navigation tabs:

1. **📊 Dashboard** - View your integrity scores and statistics
2. **✏️ Survey** - Complete assessment surveys
3. **⚙️ Settings** - Manage your account and preferences

## File Structure

```
apps/mobile/app/(tabs)/
├── _layout.tsx           ← Tab navigation configuration (UPDATED)
├── dashboard.tsx         ← Dashboard screen (NEW)
├── survey.tsx            ← Survey screen (NEW)  
├── settings.tsx          ← Settings screen (NEW)
├── index.tsx             ← Redirects to dashboard (UPDATED)
├── SurveyForm.tsx        ← Survey form component (existing)
├── explore.tsx           ← Existing screen (kept for compatibility)
└── modal.tsx             ← Existing modal
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm start

# For iOS
npm run ios

# For Android
npm run android

# For web
npm run web
```

## Dashboard Tab Features

✅ **Statistics Display**
- Average integrity score
- Total surveys completed
- Best score achieved
- Current day streak

✅ **Recent Activity**
- Last 5 surveys with timestamps
- Color-coded scores (Green/Blue/Orange/Red)
- Quick data refresh button

✅ **Empty State**
- Helpful message when no data exists
- Encourages user to take first survey

## Survey Tab Features

✅ **Assessment Interface**
- Rate 4 dimensions (Truth, Responsibility, Restraint, Power Risk)
- Instant GI2 score calculation
- Real-time feedback
- Automatic history tracking

## Settings Tab Features

✅ **Profile Section**
- View username and email
- Display current user info

✅ **Preferences**
- Toggle notifications
- View dark mode status

✅ **Data Management**
- Export survey data
- Clear local data (with confirmation)

✅ **Account**
- View app version and platform
- Logout with confirmation

## Navigating the App

### Tab Navigation
- Tap any tab at the bottom of the screen
- Icons show selected tab with highlight color
- SwipeNavigator recommended on older devices

### Within Tabs
- Each tab has its own ScrollView for content
- Pull-to-refresh available on Dashboard

### Modal Navigation
- Modal screen available from root layout
- Not visible in bottom tabs

## Data Persistence

### AsyncStorage Keys
- `session` - User authentication token
- `username` - Logged-in user's name
- `email` - User's email address
- `notifications` - Notification preference (true/false)
- `history` - Survey history (local backup)

### API Integration
- Dashboard fetches from `/api/history`
- Survey posts to `/api/history`
- Settings uses local AsyncStorage

## Design System

### Color Coding (Scores)
- 🟢 **Green** (90-100): Excellent
- 🔵 **Blue** (70-89): Good
- 🟠 **Orange** (50-69): Fair
- 🔴 **Red** (0-49): Poor

### Typography
- Titles: Large, bold
- Subtitles: Medium, dimmed
- Body: Regular weight
- Labels: Small, uppercase

### Spacing
- Card padding: 16px
- Section margin: 24px
- Border radius: 8-12px

## Key Components Used

```typescript
// Themed components
<ThemedView>       // Containers with theme support
<ThemedText>       // Text with dynamic sizing
<IconSymbol>       // SF Symbols rendering

// React Native
<ScrollView>       // Scrollable content areas
<TouchableOpacity>  // Buttons and tappable areas
<Switch>           // Toggle switches
<Alert>            // Confirmation dialogs
```

## Common Tasks

### Refresh Dashboard Data
```typescript
const refreshData = async () => {
  await loadDashboardData();
};
```

### Submit a Survey
```typescript
const handleSubmit = async () => {
  // Calculate score
  const score = calculateGI2([...]);
  
  // Send to API
  const res = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session}` },
    body: JSON.stringify({ entry: { score, timestamp } })
  });
};
```

### Update Settings
```typescript
const handleNotificationToggle = async (value: boolean) => {
  setNotifications(value);
  await AsyncStorage.setItem('notifications', JSON.stringify(value));
};
```

## Troubleshooting

### "Cannot find symbol 'Redirect'"
- Ensure `expo-router` v3+ is installed
- Run `npm install expo-router@latest`

### Dashboard shows "No data yet"
- Complete a survey in Survey tab
- Data saves automatically to API
- Pull refresh to see updates

### Settings not persisting
- Check AsyncStorage permissions
- Verify device has available storage
- Try logging out and back in

### Tabs not showing
- Run `npm start` to rebuild
- Clear cache: `npm start -c`
- Check `_layout.tsx` configuration

### API calls failing
- Verify backend server is running
- Check network connectivity
- Look at console logs for errors
- Verify `localhost:3000` is accessible

## Performance Tips

✅ **For Smooth UX**
- Memoize heavy components with `React.memo`
- Use `useCallback` for event handlers
- Lazy load images in history lists
- Implement pagination for long histories

✅ **For Data**
- Cache API responses in state
- Batch API requests where possible
- Clear old data periodically
- Use indexes in AsyncStorage queries

## Security Notes

⚠️ **Important**
- Session tokens stored in AsyncStorage (not encrypted)
- Don't store sensitive data in AsyncStorage
- Clear tokens on logout
- Use HTTPS in production
- Validate all user inputs

✅ **Best Practices**
- Always include Authorization header
- Never log sensitive data
- Use environment variables for API URLs
- Implement CORS for API calls

## Testing the Tabs

### Manual Test Checklist
- [ ] Dashboard loads without errors
- [ ] Statistics display correctly
- [ ] Recent activity shows 5 items
- [ ] Refresh button works
- [ ] Survey form submits successfully
- [ ] New score appears in dashboard
- [ ] Settings page loads
- [ ] Notification toggle works
- [ ] Logout confirmation shows
- [ ] Clear data confirmation shows

### Device Testing
- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Test on tablet (landscape mode)
- [ ] Test with slow network
- [ ] Test with offline mode

## Future Enhancements

### Planned Features
- [ ] Export data as PDF/CSV
- [ ] Trend charts and analytics
- [ ] Scheduled notifications
- [ ] Offline mode with sync
- [ ] Dark mode toggle button
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Watch app companion

### UI Improvements
- [ ] Animated transitions
- [ ] Gesture controls
- [ ] Custom tab bar styling
- [ ] Bottom sheet modals
- [ ] Pull-to-refresh with animations

## Need Help?

### Resources
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)

### Debugging
```bash
# View console logs
npm start

# Clear app cache
rm -rf node_modules/.cache

# Reset Expo cache
expo start -c

# View device logs
expo logs
```

## Version History

### v1.0.0 (Current)
- Dashboard with statistics
- Survey form integration
- Settings page
- Three-tab navigation
- Data persistence with AsyncStorage
- API integration

## Credits

Built with:
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [React Native](https://reactnative.dev)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

**Questions or feedback?** Check the [Mobile Navigation Documentation](./MOBILE_NAVIGATION.md) for detailed info.
