# Guardian Academy Development Setup Guide

## Quick Start (Choose One)

### 1. **Web + Mobile Together** (Recommended for Full-Stack)
```bash
npm run dev
```
- Starts Next.js at `http://localhost:3000`
- Starts Expo Metro Bundler (QR code for mobile)
- Perfect for testing web + mobile integration

### 2. **Everything: Web + Mobile + Scoring Engine + Audit Logger + Standards Watch**
```bash
npm run dev:full
```
- All 4 services running concurrently
- Standards folder monitored for changes
- Use when developing the scoring engine or audit system

### 3. **Web Only** (Quick Local Testing)
```bash
npm run dev:web
```
- Next.js only at `http://localhost:3000`
- Fastest for iterating on dashboard UI

### 4. **Mobile Only** (Mobile-First Development)
```bash
npm run dev:mobile
```
- Expo Metro Bundler running
- Scan QR code with Expo Go app on phone
- Good for field data collection features

### 5. **Core Packages Only** (Scoring Engine + Audit Logger)
```bash
npm run dev:core
```
- TypeScript compiler watching scoring-engine/
- TypeScript compiler watching audit-logger/
- Use when developing the GI² calculation or logging

---

## Available Commands

| Command | Purpose | Use Case |
|---------|---------|----------|
| `npm run dev` | Web + Mobile | Daily development |
| `npm run dev:web` | Next.js only | Dashboard UI work |
| `npm run dev:mobile` | Expo only | Mobile app work |
| `npm run dev:scoring` | GI² engine only | Algorithm development |
| `npm run dev:audit` | Audit logger only | Logging/auditing work |
| `npm run dev:core` | Packages only | Core logic work |
| `npm run dev:full` | Everything | Full-stack development |
| `npm run dev:watch-standards` | Standards monitor | See spec changes in real-time |
| `npm run build:all` | Build all | Before deployment |
| `npm run test:all` | Test all | Pre-commit validation |
| `npm run clean` | Reinstall deps | Fix node_modules issues |
| `npm run reset` | Full reset | Start fresh |
| `npm run standards:check` | Validate setup | Compliance check |

---

## For Termux Users

Since Termux runs on Android and resource-constrained, here's the recommended approach:

### Option 1: Web Dashboard Only (Recommended)
```bash
npm install --legacy-peer-deps
npm run dev:web
```
- Access via phone browser at `http://localhost:3000`
- Most efficient use of Termux resources

### Option 2: Core Packages (TypeScript Development)
```bash
npm install --legacy-peer-deps
npm run dev:core
```
- Develop scoring engine and audit logger
- Compile TypeScript and catch errors live
- Minimum memory footprint

### Option 3: Mobile Only (Test Expo)
```bash
npm run dev:mobile
```
- Test the Expo app
- Requires Expo Go app installed on Android

### Note on Termux Limitations
- **Don't** run `npm run dev:full` (too resource-intensive)
- Use individual commands for focused work
- If you hit resource limits, restart Termux: `apt update && apt upgrade`

---

## For Computer (Desktop Development)

### Full-Stack Day
```bash
npm run dev:full
```
- Opens Terminal 1: Web dashboard (http://localhost:3000)
- Opens Terminal 2: Mobile (Expo QR code)
- Opens Terminal 3: Scoring engine compiler
- Opens Terminal 4: Audit logger compiler
- Opens Terminal 5: Standards file monitor

### Focused Development
Choose ONE from above depending on what you're building.

---

## Troubleshooting

### Issue: Port 3000 already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev:web
```

### Issue: Expo Metro won't start
```bash
cd apps/mobile
rm -rf node_modules
npm install
expo start
```

### Issue: node_modules broken after refactor
```bash
npm run clean
# or full reset:
npm run reset
```

### Issue: Standards files not updating in IDE
```bash
npm run standards:check
```
Validates all standards files are in place and checkpoints compliance.

---

## Environment Variables

Create a `.env.local` file in `apps/web/` for Firebase:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

See `.env.example` files in each app for complete configuration.

---

## Development Workflow Example

### Scenario: Adding a New GI² Metric

1. **Update the standard:**
   ```bash
   # Edit standards/gi2-metrics.md
   # (watch-standards will log the change)
   ```

2. **Update the formula:**
   ```bash
   # Edit standards/scoring-formula.md
   ```

3. **Update data collection guide:**
   ```bash
   # Edit standards/data-collection-guidelines.md
   ```

4. **Implement in code:**
   ```bash
   # Run scoring engine watcher
   npm run dev:scoring
   # Edit packages/scoring-engine/src/index.ts to match new metric
   ```

5. **Update web dashboard:**
   ```bash
   npm run dev:web
   # Edit apps/web/src/components/MetricCard.tsx to display new metric
   ```

6. **Test and commit:**
   ```bash
   npm run test:all
   git add .
   git commit -m "Add new GI² metric: [MetricName]"
   git push origin main
   ```

---

## Monitoring & Validation

### Check Standards Compliance
```bash
npm run standards:check
```
Validates:
- ✅ All required standard files exist
- ✅ Implementation code references standards
- ✅ Governance documents are present

### Monitor Standards Changes
The `dev:watch-standards` script (part of `npm run dev:full`) logs:
- File name changed
- Timestamp
- Reminder to update implementations

---

## Performance Tips

- **Use `npm run dev` for daily work** (not `dev:full`)
- **Close unused services** to free resources
- On Termux: **Stick to `dev:web` or `dev:core`**
- Use **VS Code Remote SSH** to develop on desktop, test on Termux

---

## Next Steps

1. **Validate setup:**
   ```bash
   npm run standards:check
   ```

2. **Start developing:**
   ```bash
   npm run dev
   ```

3. **Make a change:**
   - Edit `standards/gi2-metrics.md`
   - Edit `packages/scoring-engine/src/index.ts`
   - See both compile in real-time

4. **Commit & push:**
   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin main
   ```

---

**Questions?** See [README.md](../README.md) or the [Governance Charter](../docs/governance-charter.md)
