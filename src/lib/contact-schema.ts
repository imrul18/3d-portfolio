import { z } from "zod";

/** Shared between the contact form and the API route. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Name is too long."),
  email: z.email("Enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters.")
    .max(5000, "Keep the message under 5,000 characters."),
  /** Honeypot: real visitors never fill this in. */
  company: z.string().max(0).optional().default(""),
  /** Timestamp when the form was rendered, used to reject instant bot posts. */
  startedAt: z.number().int().positive(),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };
