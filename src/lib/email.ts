import nodemailer from 'nodemailer';
import type { QuoteFormValues } from '@/lib/enquiry-schema';

// Where every website enquiry notification is delivered.
const ENQUIRY_RECIPIENT = 'wingsent07@gmail.com';

/**
 * Build a Gmail SMTP transport from env vars, or return null if email isn't
 * configured yet. Configuration is intentionally optional so the contact form
 * keeps working (lead still saved) before SMTP credentials are set.
 *
 * Required env vars (free — uses a Gmail App Password, no paid service):
 *   GMAIL_USER          the sending Gmail address (e.g. wingsent07@gmail.com)
 *   GMAIL_APP_PASSWORD  a 16-char App Password (Google Account → Security →
 *                       2-Step Verification → App passwords)
 */
function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Email a website enquiry to the business inbox. Never throws — on any failure
 * (or when SMTP isn't configured) it returns false so the caller can still
 * report success for the saved lead.
 *
 * @returns true if an email was sent, false if skipped/failed.
 */
export async function sendEnquiryEmail(
  enquiry: QuoteFormValues,
): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    // Not configured yet — quietly skip. The lead is already persisted.
    console.warn(
      '[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — enquiry email skipped.',
    );
    return false;
  }

  const { name, email, company, theatre, message, budget } = enquiry;
  const subject = `Website Enquiry — ${name} (${company})`;

  const lines = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    `Theatre: ${theatre || '—'}`,
    `Budget:  ${budget || '—'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <h2 style="margin:0 0 12px">New Website Enquiry</h2>
    <table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${escapeHtml(company)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Theatre</td><td>${escapeHtml(theatre || '—')}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Budget</td><td>${escapeHtml(budget || '—')}</td></tr>
    </table>
    <p style="margin:16px 0 4px;color:#666;font-family:system-ui,sans-serif;font-size:14px">Message</p>
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px">${escapeHtml(message)}</p>
  `;

  try {
    await transport.sendMail({
      from: `"New Wings Solutions — Website" <${process.env.GMAIL_USER}>`,
      to: ENQUIRY_RECIPIENT,
      // Let the business reply straight to the customer.
      replyTo: email,
      subject,
      text: lines,
      html,
    });
    return true;
  } catch (err) {
    // Never fail the request because of email — the lead is already saved.
    console.error('[email] failed to send enquiry notification:', err);
    return false;
  }
}
