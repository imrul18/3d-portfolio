"use client";

import { Icon } from "@/components/ui/Icon";
import type { ServiceItem } from "@/types/content";

interface ServiceDetailsProps {
  service: ServiceItem;
  discussLabel: string;
  /** Leads to the contact form, email or contact station; omitted when none exists. */
  onDiscuss?: () => void;
}

/** Everything about one service, shown in a popup from the papers. */
export function ServiceDetails({ service, discussLabel, onDiscuss }: ServiceDetailsProps) {
  return (
    <div className="space-y-6 p-6">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon name={service.icon} size={26} />
      </span>
      <p className="text-lg leading-relaxed text-foreground/90">{service.description}</p>
      {(service.details ?? []).length > 0 && (
        <ul className="space-y-2.5">
          {(service.details ?? []).map((detail) => (
            <li key={detail} className="flex gap-3 text-muted">
              <span className="text-primary">✓</span>
              {detail}
            </li>
          ))}
        </ul>
      )}
      {onDiscuss && (
        <button
          type="button"
          onClick={onDiscuss}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Icon name="mail" size={16} />
          {discussLabel}
        </button>
      )}
    </div>
  );
}
