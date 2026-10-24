import { contactConfig } from "@/config/contact";
import { contactMessageSchema, type ContactFieldErrors, type ContactResponse } from "@/lib/contact-schema";
import { deliverContactMessage, isContactFormAvailable, isRateLimited } from "@/lib/contact-server";

const MIN_FILL_TIME_MS = 3000;

function json(body: ContactResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  if (!isContactFormAvailable()) {
    return json({ ok: false, error: "The contact form is not configured. Please use email instead." }, 503);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return json({ ok: false, error: "Too many messages. Please wait a few minutes and try again." }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "The request could not be read." }, 400);
  }

  const parsed = contactMessageSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "name" || field === "email" || field === "message") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    // Honeypot or timing failures: respond as if accepted so bots learn nothing.
    if (Object.keys(fieldErrors).length === 0) return json({ ok: true }, 200);
    return json({ ok: false, error: "Please fix the highlighted fields.", fieldErrors }, 422);
  }

  if (Date.now() - parsed.data.startedAt < MIN_FILL_TIME_MS) return json({ ok: true }, 200);

  try {
    const delivered = await deliverContactMessage(parsed.data);
    if (!delivered) return json({ ok: false, error: contactConfig.form.errorMessage }, 502);
  } catch {
    return json({ ok: false, error: contactConfig.form.errorMessage }, 502);
  }

  return json({ ok: true }, 200);
}
