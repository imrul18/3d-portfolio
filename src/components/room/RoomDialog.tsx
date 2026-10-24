"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** `panel` fills the screen on phones; `card` is a centered popup. */
  variant?: "card" | "panel";
  children: ReactNode;
}

/**
 * Modal over the room, built on native <dialog> for focus trapping, Escape to
 * close and an inert background.
 */
export function RoomDialog({ open, onClose, title, subtitle, variant = "card", children }: RoomDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label={title}
      className={cn(
        "m-auto overflow-hidden border border-primary/40 bg-surface p-0 text-foreground shadow-glow backdrop:bg-black/75 backdrop:backdrop-blur-sm",
        variant === "card"
          ? "max-h-[88svh] w-[min(92vw,40rem)] rounded-[var(--r-lg)]"
          : "h-[100svh] max-h-none w-screen max-w-none rounded-none sm:h-[90svh] sm:w-[min(94vw,48rem)] sm:rounded-[var(--r-lg)]",
      )}
    >
      <div className="flex max-h-[inherit] h-full flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-strong hover:text-foreground"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
