import nodemailer from "nodemailer";

export async function sendCredentialEmail(toEmail, loginLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BBSCART CRM" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Account Credentials - BBSCART",
      html: `
        <h2>Welcome to BBSCART</h2>
        <p>Your account has been created.</p>
        <p>Click below to set your password:</p>
        <a href="${loginLink}" target="_blank">${loginLink}</a>
        <p>This link is valid for first-time login.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}