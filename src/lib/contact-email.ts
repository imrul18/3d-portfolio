import "server-only";
import { siteConfig } from "@/config/site";
import type { ContactMessage } from "@/lib/contact-schema";
import { getSiteUrl } from "@/lib/seo";

/** Escapes text for safe insertion into the HTML email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Notification sent to you when someone uses the contact form. Table-based
 * inline-styled HTML (same structure as the nordova notification emails) so
 * it renders consistently across mail clients.
 */
export function buildContactNotificationHtml(message: ContactMessage): string {
  const name = escapeHtml(message.name);
  const email = escapeHtml(message.email);
  const body = escapeHtml(message.message);
  const siteUrl = getSiteUrl();
  const siteName = escapeHtml(siteConfig.name);
  const replyHref = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: your message on ${siteConfig.name}'s portfolio`)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New portfolio message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5; color: #3f3f46;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f5; margin: 0; padding: 32px 16px;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">

<tr>
<td style="padding: 24px 32px; border-bottom: 1px solid #f0f0f1;">
<span style="font-size: 17px; font-weight: 700; color: #18181b; letter-spacing: -0.2px;">${siteName}</span>
<span style="font-size: 13px; color: #a1a1aa;"> &middot; Portfolio</span>
</td>
</tr>

<tr>
<td style="padding: 32px;">
<h1 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #18181b;">New message</h1>
<p style="margin: 0 0 24px 0; font-size: 13px; color: #a1a1aa;">Submitted via your portfolio contact form</p>

<p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #3f3f46;"><strong>${name}</strong> sent you a message.</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fafafa; border-left: 4px solid #16a34a; border-radius: 4px; margin-bottom: 24px;">
<tr>
<td style="padding: 20px 24px;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size: 14px;">
<tr>
<td style="padding: 6px 0; color: #a1a1aa; width: 110px;">Name</td>
<td style="padding: 6px 0; color: #18181b; font-weight: 600; text-align: right;">${name}</td>
</tr>
<tr>
<td style="padding: 6px 0; color: #a1a1aa;">Email</td>
<td style="padding: 6px 0; color: #18181b; font-weight: 600; text-align: right;">${email}</td>
</tr>
</table>
</td>
</tr>
</table>

<p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 6px; margin-bottom: 24px;">
<tr>
<td style="padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #3f3f46; white-space: pre-line;">${body}</td>
</tr>
</table>

<table cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
<a href="${escapeHtml(replyHref)}" style="display: inline-block; padding: 11px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 6px;">Reply to ${name}</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #f0f0f1; text-align: center;">
<p style="margin: 0; font-size: 12px; color: #a1a1aa;">Sent by the contact form on ${siteUrl ? `<a href="${escapeHtml(siteUrl)}" style="color: #a1a1aa; text-decoration: underline;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>` : "your portfolio"}.</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

/** Plain-text version for clients that don't render HTML. */
export function buildContactNotificationText(message: ContactMessage): string {
  return `New message from your portfolio contact form\n\nName: ${message.name}\nEmail: ${message.email}\n\n${message.message}\n`;
}
