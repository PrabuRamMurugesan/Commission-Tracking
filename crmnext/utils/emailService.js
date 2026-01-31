// crmnext/utils/emailService.js
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Use environment variables for email configuration
  // For Gmail, you can use App Password: https://support.google.com/accounts/answer/185833
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
    },
  });

  return transporter;
};

// Send password reset email
export const sendPasswordResetEmail = async (toEmail, resetLink, userName = "User") => {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    // Zoho requires the "from" address to match the authenticated SMTP_USER exactly
    // Use SMTP_USER as the from address (required by Zoho SMTP)
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    
    // Extract display name from MAIL_FROM if provided, otherwise use default
    let displayName = "Commission Tracking System";
    if (process.env.MAIL_FROM) {
      // Match format: "BBSCART <bbs@balabharath.com>" or "BBSCART <email>"
      const mailFromMatch = process.env.MAIL_FROM.match(/^"([^"]+)"\s*</);
      if (mailFromMatch) {
        displayName = mailFromMatch[1].trim(); // Extract display name from "Name <email>"
      }
    }
    
    const mailOptions = {
      from: `"${displayName}" <${smtpUser}>`,
      to: toEmail,
      subject: "Password Reset Request - Commission Tracking System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(90deg, #6a11cb, #2575fc); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #fff; margin: 0;">Commission Tracking System</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password for your Commission Tracking System account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(90deg, #6a11cb, #2575fc); 
                        color: #fff; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block; 
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #2575fc; word-break: break-all;">${resetLink}</a>
            </p>
            <p style="color: #666; font-size: 14px;">
              <strong>This link will expire in 1 hour.</strong>
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Commission Tracking System. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Commission Tracking System
        
        Hello ${userName},
        
        We received a request to reset your password for your Commission Tracking System account.
        
        Click the following link to reset your password:
        ${resetLink}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        
        © 2024 Commission Tracking System. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
