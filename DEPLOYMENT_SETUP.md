# Firebase Deployment Setup Guide

## Problem Fixed
Email notifications were not working when deployed to GitHub because:
- The Express server (`server.ts`) was only running locally
- GitHub Pages only deploys static files, not Node.js servers
- The `/api/enroll` and `/api/contact` endpoints didn't exist in production

## Solution
Converted the email notification endpoints to **Firebase Cloud Functions** that deploy alongside your static site.

## Setup Instructions

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Install Functions Dependencies
```bash
cd functions
npm install
cd ..
```

### 4. Configure Environment Variables

#### For Local Testing:
Create a `.env` file in the `functions` directory:
```bash
cp functions/.env.example functions/.env
```

Edit `functions/.env` and add your webhook URL:
```
WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec
```

#### For GitHub Actions Deployment:
Add the following secrets to your GitHub repository:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

2. Add these secrets:
   - **FIREBASE_TOKEN**: Get this by running `firebase login:ci`
   - **WEBHOOK_URL**: Your Google Apps Script webhook URL
   ```
   https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec
   ```
   - **VITE_WEBHOOK_URL**: Same as above (for frontend build)

#### For Firebase Functions Production:
Set the secret using Firebase CLI:
```bash
firebase functions:secrets:set WEBHOOK_URL
# When prompted, paste your webhook URL
```

### 5. Test Locally
```bash
# Terminal 1: Start Firebase emulators
cd functions
npm run serve

# Terminal 2: Run frontend dev server
npm run dev
```

Test the endpoints:
- Enrollment: http://localhost:3000/api/enroll
- Contact: http://localhost:3000/api/contact

### 6. Deploy to Firebase
```bash
firebase deploy --only hosting,functions
```

Or push to GitHub main branch to trigger automatic deployment via GitHub Actions.

## Verify Deployment

### Check Functions are Deployed:
```bash
firebase functions:list
```

You should see:
- `enroll(us-central1)`
- `contact(us-central1)`

### Check Function Logs:
```bash
firebase functions:log
```

### Test Production Endpoints:
The functions will be available at:
- `https://YOUR_PROJECT_ID.web.app/api/enroll`
- `https://YOUR_PROJECT_ID.web.app/api/contact`

## Troubleshooting

### Email notifications still not working?

1. **Check Function Logs:**
   ```bash
   firebase functions:log --only enroll,contact
   ```

2. **Verify Webhook URL is Set:**
   ```bash
   firebase functions:secrets:access WEBHOOK_URL
   ```

3. **Check Firebase Console:**
   - Go to https://console.firebase.google.com
   - Select your project
   - Navigate to Functions
   - Check for errors

4. **Test Webhook Directly:**
   ```bash
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","phone":"1234567890"}'
   ```

5. **Check CORS:**
   The functions are configured with CORS enabled for all origins. If you need to restrict this, edit `functions/src/index.ts`.

### Local Development Not Working?

1. Make sure you have the `.env` file in the `functions` directory
2. Run `npm install` in the `functions` directory
3. Use `npm run serve` instead of `npm start` in the functions directory

## Architecture

```
┌─────────────────┐
│  GitHub Push    │
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│  GitHub Actions Workflow    │
│  - Build frontend           │
│  - Build functions          │
│  - Deploy to Firebase       │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Firebase Hosting + Functions│
│  - /            → SPA        │
│  - /api/enroll  → Function  │
│  - /api/contact → Function  │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Google Apps Script Webhook │
│  - Sends email to Gmail     │
└─────────────────────────────┘
```

## Cost Considerations

Firebase Cloud Functions pricing:
- **Free tier:** 2M invocations/month, 400K GB-sec, 200K CPU-sec
- Your email notifications will likely stay within the free tier
- Monitor usage at: https://console.firebase.google.com

## Next Steps

1. ✅ Set up GitHub secrets (FIREBASE_TOKEN, WEBHOOK_URL)
2. ✅ Push to main branch to trigger deployment
3. ✅ Test enrollment and contact forms on production site
4. ✅ Monitor function logs for any errors

## Support

If you encounter issues:
1. Check the function logs: `firebase functions:log`
2. Review the GitHub Actions workflow logs
3. Verify all secrets are correctly set in GitHub repository settings
