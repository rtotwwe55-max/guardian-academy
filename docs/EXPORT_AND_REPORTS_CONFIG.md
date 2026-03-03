# Export and Scheduled Reports Configuration

This file contains configuration examples for setting up export and scheduled reports features.

## Environment Variables Template

Copy this to your `.env.local` file and fill in your values:

```env
# ==========================================
# CRON JOB CONFIGURATION
# ==========================================

# Secret key for authenticating cron job requests
# Generate a secure random string, e.g.: openssl rand -base64 32
CRON_SECRET=your-secure-cron-secret-here

# ==========================================
# EMAIL SERVICE CONFIGURATION
# ==========================================

# Email service provider
# Options: 'sendgrid', 'mailgun', 'ses', 'mock' (for development)
EMAIL_SERVICE=sendgrid

# SendGrid API Key (if using SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Email sender address
EMAIL_FROM=noreply@guardian-academy.com
EMAIL_FROM_NAME=Guardian Academy

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================

# Firebase service account (JSON string, for server-side operations)
# Get from Firebase Console > Project Settings > Service Accounts
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# ==========================================
# APP CONFIGURATION
# ==========================================

# Base URL for the application (used in cron job callbacks)
APP_URL=https://your-domain.com

# ==========================================
# OPTIONAL: EMAIL PROVIDER CONFIGS
# ==========================================

# Mailgun (if using Mailgun)
# MAILGUN_API_KEY=your-mailgun-api-key
# MAILGUN_DOMAIN=mg.your-domain.com

# AWS SES (if using SES)
# AWS_SES_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key

# ==========================================
# DEVELOPMENT FLAGS
# ==========================================

# Skip email sending in development
# EMAIL_SERVICE=mock

# Enable detailed logging
# DEBUG=guardian-academy:*
```

## Setup Instructions

### 1. Generate Cron Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

Copy the output to `CRON_SECRET` in `.env.local`

### 2. Configure Email Service

#### Option A: SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create API key: Settings > API Keys > Create API Key
3. Set `SENDGRID_API_KEY` in `.env.local`

#### Option B: Mailgun

1. Sign up at https://mailgun.com
2. Get API key and domain from dashboard
3. Set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in `.env.local`

#### Option C: AWS SES

1. Set up SES in AWS Console
2. Verify sender email address
3. Set AWS credentials in `.env.local`

#### Option D: Mock (Development Only)

```env
EMAIL_SERVICE=mock
```

This will log emails to console instead of sending.

### 3. Configure Firebase

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Convert JSON to string and set as `FIREBASE_SERVICE_ACCOUNT`

```bash
# Convert to base64 for safety
cat service-account.json | base64 | tr -d '\n'
```

### 4. Set Application URL

```env
APP_URL=http://localhost:3000        # Development
APP_URL=https://your-domain.com      # Production
```

## Cron Job Integration

### EasyCron Setup

1. Go to https://www.easycron.com/user/register
2. Sign up for free account
3. Click "Add a cron job"
4. Fill in:
   - **URL**: `https://your-domain.com/api/cron/process-reports`
   - **Method**: POST
   - **Custom headers**: Add under "Additional params"
     ```
     x-cron-secret: [YOUR_CRON_SECRET]
     ```
   - **Execution frequency**: Every 1 hour
   - **Notifications**: Enable to get alerts if job fails

### Alternative: Use Node.js Script

Create a `scripts/process-reports.js`:

```javascript
const fetch = require('node-fetch');

const secret = process.env.CRON_SECRET;
const appUrl = process.env.APP_URL;

if (!secret || !appUrl) {
  console.error('CRON_SECRET and APP_URL must be set');
  process.exit(1);
}

fetch(`${appUrl}/api/cron/process-reports`, {
  method: 'POST',
  headers: {
    'x-cron-secret': secret,
    'Content-Type': 'application/json',
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log('Reports processed:', data);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Then schedule with node cron or your system's cron:

```bash
# Add to crontab (every hour)
0 * * * * cd /path/to/app && node scripts/process-reports.js
```

## Testing

### Test Email Service

```bash
# Test SendGrid
curl -X POST "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -d '{
    "personalizations":[{"to":[{"email":"test@example.com"}]}],
    "from":{"email":"noreply@guardian-academy.com"},
    "subject":"Test",
    "content":[{"type":"text/plain","value":"Test email"}]
  }'
```

### Test Cron Endpoint

```bash
curl -X POST \
  -H "x-cron-secret: $(cat .env.local | grep CRON_SECRET | cut -d'=' -f2)" \
  http://localhost:3000/api/cron/process-reports
```

### Test Report Generation

```bash
# Generate and save a report
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reportType":"summary","notes":"Test report"}' \
  http://localhost:3000/api/export
```

## Monitoring

### Check Report Processing Health

```bash
# Health check
curl -H "x-cron-secret: YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/process-reports
```

### View Logs

```bash
# In development
npm run dev

# In production
tail -f logs/app.log | grep "process-reports"
```

### Database Queries

Check number of scheduled reports:

```sql
-- Firebase
db.collection('scheduledReports').where('enabled', '==', true).count()

-- Check last generated time
db.collection('scheduledReports').orderBy('lastGenerated', 'desc').limit(10)
```

## Troubleshooting

### Scheduled Reports Not Processing

1. Verify cron job is running:
   ```bash
   curl http://localhost:3000/api/cron/process-reports \
     -H "x-cron-secret: YOUR_SECRET"
   ```

2. Check logs for errors

3. Verify scheduled reports have `enabled: true`

4. Check `nextScheduled` time is before current time

### Emails Not Sending

1. Test individual email:
   ```bash
   # Update EMAIL_SERVICE in .env.local to test endpoint
   npm run dev
   ```

2. Verify SendGrid/Mailgun account is active

3. Check sender email is verified in email service

4. Review email service logs/bounce list

### Database Connectivity

1. Verify Firebase credentials are correct
2. Check Firebase project exists and Firestore is enabled
3. Check network connectivity to Firebase

## Production Checklist

- [ ] Generate strong `CRON_SECRET`
- [ ] Configure email service (SendGrid, Mailgun, or SES)
- [ ] Set `APP_URL` to production domain
- [ ] Configure Firebase with production credentials
- [ ] Enable HTTPS for email security
- [ ] Set up cron job with your chosen service
- [ ] Test cron job manually
- [ ] Monitor first scheduled report execution
- [ ] Set up alerts for failed reports
- [ ] Review email logs regularly
- [ ] Back up scheduled report configurations
- [ ] Document recovery procedures
