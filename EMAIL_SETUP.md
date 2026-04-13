# Email Notification Setup (Direct POST Method)

## How It Works

Your application uses a **simple, direct approach** to send email notifications:

```
User fills form → Frontend POSTs to Google Apps Script → Gmail receives email
```

No backend server or Firebase Functions needed! ✨

## Architecture

```
┌─────────────────────┐
│  User fills form    │
│  (Enroll/Contact)   │
└──────────┬──────────┘
           │
           v
┌─────────────────────────────────┐
│  Frontend (Browser)             │
│  - Saves to Firestore           │
│  - POSTs JSON to webhook        │
└──────────┬──────────────────────┘
           │
           v
┌─────────────────────────────────┐
│  Google Apps Script Webhook     │
│  (Serverless)                   │
└──────────┬──────────────────────┘
           │
           v
┌─────────────────────────────────┐
│  Gmail: ajay.ai.spoc@gmail.com  │
│  ✅ Email delivered!            │
└─────────────────────────────────┘
```

## Setup Instructions

### 1. Verify Your Google Apps Script Webhook

Your webhook URL is:
```
https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec
```

**Test it:**
```bash
curl -X POST "https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "_subject": "Test Email",
    "_timestamp": "2024-01-01T00:00:00Z"
  }'
```

Check `ajay.ai.spoc@gmail.com` for the test email.

### 2. Configure GitHub Secret

Add this secret to your GitHub repository:

**Go to:** https://github.com/ajayaispoc-oss/genaichatgpt/settings/secrets/actions

**Add secret:**
- Name: `VITE_WEBHOOK_URL`
- Value: `https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec`

### 3. Deploy

Push to GitHub:
```bash
git push origin main
```

The workflow will:
1. Build the frontend with `VITE_WEBHOOK_URL` embedded
2. Deploy to Firebase Hosting
3. ✅ Done!

## How the Frontend Code Works

### Enrollment Form (`/api/enroll`)

When a user clicks "Enroll Now" and submits the form:

```typescript
// From src/App.tsx line 373-406
const sendNotification = async (data: any) => {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      _subject: `New Enrollment: ${data.name}`,
      _timestamp: new Date().toISOString()
    }),
  });

  return response.ok || response.status === 302;
};
```

### Contact Form (`/api/contact`)

Same approach for contact form submissions.

## What Gets Sent to Gmail

### Enrollment Email Format:
```
Subject: New Enrollment: John Doe

Name: John Doe
Email: john@example.com
Phone: 1234567890
City: New York
Status: professional
Experience: 5 Years
Existing Role: Software Engineer
Target Role: AI Engineer
```

### Contact Email Format:
```
Subject: New Contact Inquiry: Jane Smith

Name: Jane Smith
Phone: 0987654321
Requirement: Need help with GenAI training
```

## Benefits of This Approach

✅ **Simple** - No backend server to maintain
✅ **Fast** - Direct POST from browser to webhook
✅ **Reliable** - Google Apps Script has 99.9% uptime
✅ **Free** - No Firebase Functions costs
✅ **Secure** - Webhook URL is embedded at build time
✅ **Works Everywhere** - Static hosting compatible (GitHub Pages, Firebase Hosting, Vercel, etc.)

## Troubleshooting

### Email not received?

1. **Check webhook is accessible:**
   ```bash
   curl -I https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec
   ```
   Should return `HTTP/2 302` (redirect is normal for Google Apps Script)

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Network tab
   - Submit form
   - Look for POST request to webhook URL
   - Check if it returns 200 or 302

3. **Check spam folder:**
   - Emails might be in Gmail spam folder

4. **Verify VITE_WEBHOOK_URL is set:**
   - Check GitHub Actions build logs
   - Confirm environment variable is passed during build

5. **Check Google Apps Script logs:**
   - Go to https://script.google.com
   - Open your script
   - View → Executions
   - Check for errors

## Local Development

For local testing, create `.env` file:
```bash
VITE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwltDYnepV5mAZ_1Rc7gL6cp7iLa7WAgOQgLH-O32DcpUCp5jf9kVgkQrrsSjoLdySjqA/exec
```

Then run:
```bash
npm run dev
```

Test the forms at http://localhost:3000

## Security Notes

- The webhook URL is public but can only send emails (no sensitive operations)
- Google Apps Script rate limits prevent abuse (100 emails/day for free accounts)
- Consider adding reCAPTCHA if you get spam submissions
- Data is also saved to Firestore with security rules

## Need Help?

If emails still aren't working:
1. Check all troubleshooting steps above
2. Verify the Google Apps Script is deployed and accessible
3. Check Gmail spam/junk folder
4. Review browser console and network logs
