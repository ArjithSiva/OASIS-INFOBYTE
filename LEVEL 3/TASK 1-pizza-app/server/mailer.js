import nodemailer from 'nodemailer';
let transporter;
async function getTransport() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  } else {
    const acc = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, auth: { user: acc.user, pass: acc.pass } });
    console.log('[mail] No SMTP_HOST set – using Ethereal test inbox');
  }
  return transporter;
}
export async function sendMail(to, subject, html) {
  try {
    const t = await getTransport();
    const info = await t.sendMail({ from: process.env.MAIL_FROM || 'Pizzeria <no-reply@pizzeria.test>', to, subject, html });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log(`[mail] "${subject}" -> ${to}\n[mail] Preview: ${preview}`);
  } catch (e) { console.error('[mail] failed:', e.message); }
}
