import "server-only";
import { contactConfig } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { buildContactNotificationHtml, buildContactNotificationText } from "@/lib/contact-email";
import type { ContactMessage } from "@/lib/contact-schema";

/**
 * The contact form sends through the Aetherix mail API (the MailServer
 * project: `POST /api/send-mail`), which queues the email and delivers it
 * through its own SMTP account. It is only offered when these are set.
 */
function getMailApiSettings() {
  const url = process.env.MAIL_API_URL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!url || !to) return undefined;
  return {
    url,
    to,
    apiKey: process.env.MAIL_API_KEY?.trim() || undefined,
    fromName: process.env.MAIL_FROM_NAME?.trim() || `${siteConfig.name} — Portfolio`,
    from: process.env.MAIL_FROM_ADDRESS?.trim() || undefined,
  };
}

export function isContactFormAvailable(): boolean {
  return contactConfig.form.enabled && getMailApiSettings() !== undefined;
}

/** Sends you the contact notification. Resolves true once the mail API has queued it. */
export async function deliverContactMessage(message: ContactMessage): Promise<boolean> {
  const settings = getMailApiSettings();
  if (!settings) return false;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  // The API doesn't require a key today; send one if configured, as other clients do.
  if (settings.apiKey) headers.Authorization = `Bearer ${settings.apiKey}`;

  const response = await fetch(settings.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      to: [settings.to],
      subject: `New portfolio message — ${message.name}`,
      html: buildContactNotificationHtml(message),
      text: buildContactNotificationText(message),
      from_name: settings.fromName,
      ...(settings.from && { from: settings.from }),
      data: { source: "portfolio-contact", reply_to: message.email },
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok && process.env.NODE_ENV === "development") {
    console.warn(`Mail API responded ${response.status}: ${await response.text().catch(() => "")}`);
  }
  return response.ok;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

/** Best-effort, per-instance rate limit. Use a shared store for multi-instance deploys. */
export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}
