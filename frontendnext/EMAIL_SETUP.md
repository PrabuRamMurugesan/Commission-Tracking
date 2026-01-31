# Email Configuration Guide

To enable password reset emails, you need to configure SMTP settings in your `.env.local` file.

## Required Environment Variables

Add the following to `crmnext/.env.local`:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Alternative variable names (also supported)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_APP_PASSWORD=your-app-password-here

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:5174
```

## Gmail Setup Instructions

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Commission Tracking System" as the name
   - Copy the generated 16-character password
   - Use this password as `SMTP_PASS` (NOT your regular Gmail password)

3. **Update `.env.local`**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Testing

After configuration, restart your Next.js server and test the forgot password functionality. Check the server console for email sending status.

## Troubleshooting

- **"Invalid login" error**: Check that you're using an App Password for Gmail, not your regular password
- **"Connection timeout"**: Verify SMTP_HOST and SMTP_PORT are correct
- **"Authentication failed"**: Double-check SMTP_USER and SMTP_PASS
- Check server console logs for detailed error messages
