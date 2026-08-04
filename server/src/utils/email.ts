import nodemailer from "nodemailer";

let _transport: nodemailer.Transporter | null = null;

function getTransport() {
  if (_transport) return _transport;

  const port = Number(process.env.SMTP_TLS_PORT || process.env.SMTP_SSL_PORT) || 587;

  _transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return _transport;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const from = process.env.SMTP_USER;

  if (!from) {
    throw new Error("SMTP_USER must be set in environment.");
  }

  return getTransport().sendMail({ from, to, subject, html });
}


export async function sendOtpEmail(to: string, otp: string, purpose: "reset-password" | "verify-email",) {
  const isReset = purpose === "reset-password";
  const title = isReset ? "Reset Your Password" : "Verify Your Email";
  const description = isReset
    ? "You requested a password reset for your Thumblify account. Use the code below to set a new password."
    : "Welcome to Thumblify! Use the code below to verify your email address.";

  const html = `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:12px">
      <h2 style="margin:0 0 8px;font-size:22px;color:#111827">${title}</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.6">${description}</p>
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;text-align:center">
        <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#e63946">${otp}</span>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;line-height:1.5">
        This code expires in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
      <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center">Thumblify &mdash; AI Thumbnail Generator</p>
    </div>
  `;

  return sendEmail({ to, subject: `${title} — Thumblify`, html });
}
