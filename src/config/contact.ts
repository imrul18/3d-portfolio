import type { ContactConfig } from "@/types/content";

/** Shown on the phone in the room. */
export const contactConfig: ContactConfig = {
  heading: "Get in touch",
  intro:
    "Tell me what you're building and where you need help. I usually reply within a few working days.",

  // Your public address. It is only shown when `publishEmail` is true.
  email: "imrul.afnan18@gmail.com",
  publishEmail: true,

  form: {
    enabled: true,
    submitLabel: "Send message",
    successMessage: "Message sent. I'll get back to you soon.",
    errorMessage: "The message couldn't be sent. Please try again or use email instead.",
  },
};
