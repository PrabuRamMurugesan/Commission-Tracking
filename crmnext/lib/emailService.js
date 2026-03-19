// // import nodemailer from "nodemailer";

// // export async function sendCredentialEmail(toEmail, loginLink) {
// //     try {
// //         // const transporter = nodemailer.createTransport({
// //         //   service: "gmail",
// //         //   auth: {
// //         //     user: process.env.EMAIL_USER,
// //         //     pass: process.env.EMAIL_PASS,
// //         //   },
// //         // });

// //         const transporter = nodemailer.createTransport({
// //             host: process.env.SMTP_HOST,
// //             port: Number(process.env.SMTP_PORT),
// //             secure: process.env.SMTP_SECURE === "true",
// //             auth: {
// //                 user: process.env.SMTP_USER,
// //                 pass: process.env.SMTP_PASS,
// //             },
// //         });

// //         const mailOptions = {
// //             // from: `"BBSCART CRM" <${process.env.EMAIL_USER}>`,
// //             from: process.env.MAIL_FROM,
// //             to: toEmail,
// //             subject: "Your Account Credentials - BBSCART",
// //             html: `
// //         <h2>Welcome to BBSCART</h2>
// //         <p>Your account has been created.</p>
// //         <p>Click below to set your password:</p>
// //         <a href="${loginLink}" target="_blank">${loginLink}</a>
// //         <p>This link is valid for first-time login.</p>
// //       `,
// //         };

// //         await transporter.sendMail(mailOptions);

// //         return true;
// //     } catch (err) {
// //         console.error("Email error:", err);
// //         return false;
// //     }
// // }


// import nodemailer from "nodemailer";

// export async function sendCredentialEmail(toEmail, loginLink) {
//   try {
//     console.log("Sending email to:", toEmail);

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       secure: process.env.SMTP_SECURE === "true",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_FROM,
//       to: toEmail,
//       subject: "Your BBSCART Account Credentials",
//       html: `
//         <h2>Welcome to BBSCART</h2>
//         <p>Your account has been created.</p>
//         <p>Click below to set your password:</p>
//         <a href="${loginLink}" target="_blank">${loginLink}</a>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     console.log("Email sent successfully");

//     return true;
//   } catch (err) {
//     console.error("FULL EMAIL ERROR:", err);
//     return false;
//   }
// }


// ================== lib/emailService.js ==================
// lib/emailService.js

import nodemailer from "nodemailer";

export async function sendCredentialEmail(email, loginLink) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: "Set Your Password - BBSCART",
            html: `
        <h2>Welcome to BBSCART</h2>
        <p>Your account has been created.</p>
        <p>Click below to set your password:</p>
        <a href="${loginLink}">${loginLink}</a>
      `,
        });

        console.log("EMAIL SENT:", info.messageId);
        return true;
    } catch (err) {
        console.error("SMTP ERROR:", err);
        return false;
    }
}