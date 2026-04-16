const nodemailer = require("nodemailer");

let cachedTransporter = null;

const hasSmtpConfig = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_FROM &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
};

const getTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: String(process.env.SMTP_PASS || "").replace(/\s+/g, ""),
        }
      : undefined,
  });

  return cachedTransporter;
};

const sendOtpEmail = async ({ to, name, otp, purpose, role }) => {
  const transporter = getTransporter();
  const subject = `Your LPG sharing verification code`;
  const text = [
    `Hello ${name || "there"},`,
    "",
    `Your verification code for ${purpose} is: ${otp}`,
    "",
    `Role: ${role || "n/a"}`,
    "",
    "This code expires in 10 minutes.",
    "If you did not request this, ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 12px">LPG Sharing Verification</h2>
      <p>Hello ${name || "there"},</p>
      <p>Your verification code for <strong>${purpose}</strong> is:</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 20px;background:#111827;color:#fff;display:inline-block;border-radius:12px">${otp}</div>
      <p style="margin-top:16px">Role: <strong>${role || "n/a"}</strong></p>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[OTP EMAIL] ${to} | ${subject} | code=${otp}`);
    return {
      sent: false,
      skipped: true,
      preview: {
        to,
        subject,
        text,
      },
    };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

  return {
    sent: true,
    skipped: false,
    messageId: info.messageId,
  };
};

module.exports = {
  sendOtpEmail,
  hasSmtpConfig,
};
