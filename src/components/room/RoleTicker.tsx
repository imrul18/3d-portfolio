"use client";

import { useEffect, useState } from "react";
import { useAllowMotion } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/utils";

interface RoleTickerProps {
  roles: string[];
  /** Milliseconds per role. */
  interval: number;
  className?: string;
  /** Pause cycling (e.g. while the line is hidden). */
  paused?: boolean;
}

/**
 * Cycles through roles: the next one slides down into place from the top
 * while the previous one slides out below. With reduced motion the text
 * simply changes.
 */
export function RoleTicker({ roles, interval, className, paused = false }: RoleTickerProps) {
  const allowMotion = useAllowMotion();
  const [{ index, previous }, setState] = useState<{ index: number; previous?: number }>({ index: 0 });

  useEffect(() => {
    if (paused || roles.length < 2) return;
    const timer = window.setInterval(() => {
      setState((state) => ({ previous: state.index, index: (state.index + 1) % roles.length }));
    }, interval);
    return () => window.clearInterval(timer);
  }, [paused, roles.length, interval]);

  if (roles.length === 0) return null;

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      {/* Screen readers get the whole list once instead of constant changes. */}
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true" className="relative block">
        {/* Invisible sizer keeps the line height stable. */}
        <span className="invisible block whitespace-nowrap">{roles[index]}</span>
        <span
          key={`in-${index}`}
          className={cn("absolute inset-0 block whitespace-nowrap", allowMotion && previous !== undefined && "role-slide-in")}
        >
          {roles[index]}
        </span>
        {allowMotion && previous !== undefined && (
          <span key={`out-${previous}-${index}`} className="role-slide-out absolute inset-0 block whitespace-nowrap">
            {roles[previous]}
          </span>
        )}
      </span>
    </span>
  );
}
