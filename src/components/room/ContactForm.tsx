"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ContactFieldErrors, ContactResponse } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  fallbackEmail?: string;
}

type Status = { state: "idle" | "submitting" | "success" } | { state: "error"; message: string };

const inputClass =
  "w-full rounded-[var(--r-md)] border border-border bg-background px-4 py-3 text-foreground placeholder:text-subtle transition-colors focus:border-primary/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-ring aria-[invalid=true]:border-danger";

export function ContactForm({ submitLabel, successMessage, errorMessage, fallbackEmail }: ContactFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  // When the form appeared; the server rejects submissions made within a few
  // seconds of that (typical of bots). Set on mount so autofill-and-send works.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ state: "submitting" });
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
          startedAt: startedAt.current,
        }),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        form.reset();
        setStatus({ state: "success" });
      } else {
        setErrors(result.fieldErrors ?? {});
        setStatus({ state: "error", message: result.error });
      }
    } catch {
      setStatus({ state: "error", message: errorMessage });
    }
  };

  if (status.state === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[var(--r-lg)] border border-success/30 bg-success/10 p-8">
        <CheckCircle2 className="text-success" size={28} aria-hidden="true" />
        <p className="text-lg text-foreground">{successMessage}</p>
        <Button variant="secondary" onClick={() => setStatus({ state: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  const field = (name: keyof ContactFieldErrors) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  const fieldError = (name: keyof ContactFieldErrors) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-danger">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium text-foreground">
            Name
          </label>
          <input {...field("name")} type="text" autoComplete="name" required maxLength={100} className={inputClass} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input {...field("email")} type="email" autoComplete="email" required maxLength={200} className={inputClass} />
          {fieldError("email")}
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea {...field("message")} required rows={5} maxLength={5000} className={cn(inputClass, "resize-y")} />
        {fieldError("message")}
      </div>

      {/* Honeypot, hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.state === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-[var(--r-md)] border border-danger/30 bg-danger/10 p-3 text-sm text-foreground">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
          <span>
            {status.message}
            {fallbackEmail && (
              <>
                {" "}
                <a href={`mailto:${fallbackEmail}`} className="font-medium underline underline-offset-4">
                  {fallbackEmail}
                </a>
              </>
            )}
          </span>
        </p>
      )}

      <Button type="submit" size="lg" disabled={status.state === "submitting"} className="w-full sm:w-auto">
        {status.state === "submitting" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
