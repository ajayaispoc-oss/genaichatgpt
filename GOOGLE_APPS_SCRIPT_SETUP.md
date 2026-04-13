# Google Apps Script Setup for Email Notifications

## The Problem

Your current webhook URL returns "Page not found", which means it's either:
- Not properly deployed as a web app
- Expired or invalidated
- Missing from your Google Apps Script

## Solution: Deploy a New Google Apps Script

### Step 1: Open Google Apps Script

1. Go to: https://script.google.com
2. Sign in with `ajay.ai.spoc@gmail.com`

### Step 2: Create New Project

1. Click **"New project"** (top left)
2. You'll see a blank `Code.gs` file

### Step 3: Paste the Script Code

1. **Delete** all existing code in `Code.gs`
2. **Copy** the code from `google-apps-script-email.js` in this repository
3. **Paste** it into `Code.gs`
4. Click the **💾 Save icon** (or Ctrl+S / Cmd+S)
5. Rename the project to "GenAI ChatGPT Email Notifier" (click "Untitled project" at top)

### Step 4: Deploy as Web App

1. Click **"Deploy"** button (top right)
2. Select **"New deployment"**
3. Click the ⚙️ gear icon next to "Select type"
4. Choose **"Web app"**
5. Fill in the deployment settings:
   - **Description**: "Email notification webhook for genaichatgpt.com"
   - **Execute as**: **Me** (ajay.ai.spoc@gmail.com)
   - **Who has access**: **Anyone**
6. Click **"Deploy"**

### Step 5: Authorize the Script

1. A popup will ask for authorization
2. Click **"Authorize access"**
3. Choose your Google account (ajay.ai.spoc@gmail.com)
4. You'll see a warning "Google hasn't verified this app"
   - Click **"Advanced"**
   - Click **"Go to GenAI ChatGPT Email Notifier (unsafe)"**
   - Click **"Allow"**

### Step 6: Copy the Web App URL

1. After deployment, you'll see a **Web App URL**
2. It will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
3. **Copy this entire URL** (you'll need it in the next step)

### Step 7: Test the Webhook

Test it immediately to make sure it works:

```bash
curl -X POST "YOUR_WEB_APP_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "subject": "Test Email from Google Apps Script"
  }'
```

**Check your Gmail** (`ajay.ai.spoc@gmail.com`) - you should receive a test email!

### Step 8: Update Your Project

1. **Update local `.env` file:**
   ```bash
   VITE_WEBHOOK_URL=YOUR_NEW_WEB_APP_URL
   ```

2. **Update `.env.example` file:**
   ```bash
   VITE_WEBHOOK_URL=YOUR_NEW_WEB_APP_URL
   ```

3. **Update GitHub Secret:**
   - Go to: https://github.com/ajayaispoc-oss/genaichatgpt/settings/secrets/actions
   - Click on `VITE_WEBHOOK_URL` secret
   - Click "Update secret"
   - Paste your new Web App URL
   - Click "Update secret"

### Step 9: Commit and Deploy

```bash
git add .env.example google-apps-script-email.js GOOGLE_APPS_SCRIPT_SETUP.md
git commit -m "Update webhook URL with new Google Apps Script deployment"
git push origin main
```

### Step 10: Test Your Website

1. Wait for GitHub Actions to complete deployment
2. Visit: https://genaichatgpt-a7734.web.app
3. Fill out the **Enroll Now** form
4. Submit it
5. **Check your Gmail** - you should receive the email! ✅

---

## Troubleshooting

### Email still not received?

**1. Check Google Apps Script Executions:**
   - Go to: https://script.google.com
   - Open your project
   - Click "Executions" (left sidebar, clock icon)
   - Look for recent executions
   - Check for errors

**2. Check Spam Folder:**
   - The emails might be in your Gmail spam folder

**3. Verify Webhook URL:**
   ```bash
   # Should return a success message
   curl "YOUR_WEB_APP_URL"
   ```

**4. Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Fill out form and submit
   - Look for any errors
   - Check Network tab for the POST request

**5. Redeploy the Script:**
   - Go to your Google Apps Script
   - Click "Deploy" > "Manage deployments"
   - Click the "New deployment" button
   - Create a new version
   - Get the new URL and update everywhere

---

## How to Update the Script Later

If you need to modify the email template or logic:

1. Go to https://script.google.com
2. Open your project
3. Make changes to the code
4. Click **Deploy** > **Manage deployments**
5. Click **"New deployment"** (don't use "Test deployments")
6. The Web App URL should stay the same
7. Or create a new deployment and update the URL everywhere

---

## Security Notes

- The webhook URL is public but can only send emails (no read/write to your account)
- Google Apps Script has built-in rate limiting (~100 emails/day for free accounts)
- Consider adding reCAPTCHA to your forms if you receive spam
- The script only sends emails to `ajay.ai.spoc@gmail.com` (hardcoded)

---

## Need Help?

If you're stuck:
1. Check the Executions log in Google Apps Script for errors
2. Make sure "Anyone" has access to the web app
3. Verify the Web App URL is correct (should end with `/exec`)
4. Try redeploying the script as a new deployment
