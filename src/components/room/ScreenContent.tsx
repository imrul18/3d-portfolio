"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { formatDuration, formatRange, formatYearMonth } from "@/lib/dates";
import { cn, initials } from "@/lib/utils";
import type { EmploymentType, WorkLocation } from "@/types/experience";
import type { ProjectCardData } from "@/types/project-card";
import type { RoomData } from "@/types/room";

type Experience = NonNullable<RoomData["experience"]>;
type Skills = NonNullable<RoomData["skills"]>;
type Projects = NonNullable<RoomData["projects"]>;
type About = NonNullable<RoomData["about"]>;
type Contact = NonNullable<RoomData["contact"]>;
type Service = NonNullable<RoomData["services"]>["items"][number];

/**
 * `screen`: sized for a surface in the 3D room.
 * `panel`: the same content laid out for the full-screen reading panel on phones.
 */
export type ScreenLayout = "screen" | "panel";

const EMPLOYMENT: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
  "self-employed": "Self-employed",
};

function describeLocation(location: WorkLocation | undefined) {
  if (!location) return undefined;
  if (location.kind === "remote") return location.region ? `Remote · ${location.region}` : "Remote";
  if (location.kind === "hybrid") return location.place ? `${location.place} (hybrid)` : "Hybrid";
  return location.place ?? "On-site";
}

/**
 * Date range and length for a role or card. A past entry without an end date
 * shows only its start, never "Present".
 */
function period(start: string, end: string | undefined, current: boolean, presentLabel: string, now: Date) {
  if (!current && !end) return formatYearMonth(start) ?? start;
  const duration = formatDuration(start, end, now);
  return `${formatRange(start, end, presentLabel)}${duration ? ` · ${duration}` : ""}`;
}

/** File-name style tab label, e.g. "Aetherix Limited" → "aetherix.tsx". */
function tabName(company: string) {
  return `${company.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]+/g, "")}.tsx`;
}

/** One company: overall span, then a timeline of every role held there. */
function ExperienceCardView({
  card,
  presentLabel,
  now,
  layout,
}: {
  card: Experience["cards"][number];
  presentLabel: string;
  now: Date;
  layout: ScreenLayout;
}) {
  const current = card.currentlyWorking;
  const meta = [card.employmentType ? EMPLOYMENT[card.employmentType] : undefined, describeLocation(card.location)].filter(Boolean);

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5",
        layout === "screen" && "min-h-0",
        current ? "border-primary/35 shadow-[0_0_24px_-12px_var(--primary)]" : "border-white/10",
      )}
    >
      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
            current ? "bg-primary/15 text-primary" : "bg-white/5 text-white/45",
          )}
        >
          <span className={cn("size-1.5 rounded-full", current ? "bg-primary" : "bg-white/40")} />
          {current ? "CURRENT" : "PAST"}
        </span>
        <span className="text-white/50">{period(card.startDate, card.endDate, current, presentLabel, now)}</span>
      </div>

      <h3 className="mt-3 flex items-center gap-2 font-sans text-[22px] font-bold leading-tight tracking-tight text-white">
        {card.companyUrl ? (
          <a href={card.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
            {card.company}
            <Icon name="arrow-up-right" size={16} className="text-white/40" />
          </a>
        ) : (
          card.company
        )}
      </h3>
      {meta.length > 0 && <p className="mt-1 font-sans text-xs text-white/45">{meta.join(" · ")}</p>}

      {/* Roles at this company, newest first */}
      <ol
        className={cn(
          "mt-4 space-y-4 font-sans",
          layout === "screen" && "min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]",
        )}
      >
        {card.roles.map((role, index) => (
          <li key={role.id} className="relative pl-6">
            {/* Timeline rail (drawn inside the scroll area so nothing is clipped) */}
            {index < card.roles.length - 1 && (
              <span aria-hidden="true" className="absolute -bottom-4 left-[4px] top-4 w-px bg-white/15" />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-1.5 size-2.5 rounded-full border-2",
                role.currentlyWorking ? "border-primary bg-primary shadow-[0_0_8px_var(--primary)]" : "border-white/30 bg-[#07090c]",
              )}
            />
            <p className="text-[15px] font-semibold text-white">{role.title}</p>
            <p className="font-mono text-[11px] text-white/45">
              {period(role.startDate, role.endDate, role.currentlyWorking, presentLabel, now)}
            </p>
            {role.description && <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">{role.description}</p>}
            {(role.responsibilities ?? []).length > 0 && (
              <ul className="mt-1.5 space-y-1 text-[12.5px] leading-snug text-white/80">
                {(role.responsibilities ?? []).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {(role.achievements ?? []).length > 0 && (
              <ul className="mt-1.5 space-y-1 text-[12.5px] leading-snug text-white/80">
                {(role.achievements ?? []).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#febc2e]">★</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {card.technologies.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3" aria-label="Technologies">
          {card.technologies.map((tech) => (
            <li key={tech} className="rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 font-mono text-[10.5px] text-primary">
              {tech}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** Code-editor window with one card per company. */
export function ExperienceScreen({
  cards,
  presentLabel,
  logo,
  layout = "screen",
}: Experience & { logo: string; layout?: ScreenLayout }) {
  // Client-only (the room never renders on the server), so "now" is safe here.
  const [now] = useState(() => new Date());
  const visible = layout === "screen" ? cards.slice(0, 3) : cards;

  return (
    <div className={cn("flex flex-col bg-[#07090c] text-[#c9d1d9]", layout === "screen" ? "h-full" : "min-h-full")}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="mx-auto truncate text-xs text-white/40">
          ~/my-journey — {logo.toLowerCase()} · main · {cards.reduce((total, card) => total + card.roles.length, 0)} roles
        </span>
        <span className="size-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
      </div>

      {layout === "screen" && (
        <div className="grid border-b border-white/10 font-mono text-xs" style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
          {visible.map((card, index) => (
            <p key={card.id} className={cn("px-4 py-2 text-center", index === 0 ? "border-b-2 border-primary text-white/80" : "text-white/40")}>
              {String(index + 1).padStart(2, "0")} {tabName(card.company)}
            </p>
          ))}
        </div>
      )}

      <div
        className={cn("p-4", layout === "screen" ? "grid min-h-0 flex-1 gap-4 overflow-hidden" : "space-y-4")}
        style={layout === "screen" ? { gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` } : undefined}
      >
        {visible.map((card) => (
          <ExperienceCardView key={card.id} card={card} presentLabel={presentLabel} now={now} layout={layout} />
        ))}
      </div>
    </div>
  );
}

/** Terminal-style skills listing for the laptop. */
export function SkillsScreen({ categories }: Skills) {
  return (
    <div className="h-full overflow-y-auto bg-[#050807] p-6 font-mono text-[15px] text-[#b8f5cf] [scrollbar-width:thin]">
      {categories.map((category, index) => (
        <section key={category.id} className="mb-5">
          <h3 className="flex items-center gap-3 text-lg text-white">
            <span className="text-primary/70">{String(index + 1).padStart(2, "0")}</span>
            <Icon name={category.icon} size={16} className="text-primary" />
            {category.label}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 pl-9">
            {category.skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="size-1.5 rounded-sm bg-primary" />
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Project grid for the TV. Clicking a project with details opens its popup. */
export function ProjectsScreen({
  items,
  onOpen,
  layout = "screen",
}: Projects & { onOpen: (project: ProjectCardData) => void; layout?: ScreenLayout }) {
  return (
    <div className="flex h-full flex-col bg-[#0a0c10] p-6 text-white">
      <div className="mb-4 flex items-end justify-between">
        <h3 className="text-2xl font-bold">All projects</h3>
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {items.length} projects
        </span>
      </div>
      <ul className={cn("grid min-h-0 flex-1 auto-rows-max content-start gap-3 overflow-y-auto [scrollbar-width:thin]", layout === "screen" ? "grid-cols-5" : "grid-cols-2")}>
        {items.map((project) => {
          const body = (
            <>
              <div className="relative flex aspect-[16/10] items-end justify-end bg-gradient-to-br from-primary/25 via-[#13241a] to-[#0d1512] p-2">
                {project.coverImage ? (
                  <Image src={project.coverImage.src} alt={project.coverImage.alt} fill sizes="200px" className="object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white/20">{initials(project.name)}</span>
                )}
              </div>
              <div className="p-2.5 text-left">
                <p className="truncate text-sm font-semibold">{project.name}</p>
                <p className="truncate text-xs text-white/50">{project.categoryLabel}</p>
              </div>
            </>
          );
          return (
            <li key={project.id} className="relative overflow-hidden rounded-md border border-white/10 bg-white/[0.04] transition-colors hover:border-primary/60">
              {project.hasDetails ? (
                <button type="button" onClick={() => onOpen(project)} className="block w-full" aria-label={`Open ${project.name}`}>
                  {body}
                </button>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** One service, typed onto a sheet of paper. Clicking it opens the details popup. */
export function ServicePaperContent({ service, onOpen }: { service: Service; onOpen: (service: Service) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(service)}
      aria-label={`Open ${service.title}`}
      className="group flex h-full w-full flex-col bg-[#f1ead8] p-6 text-left font-mono text-[#2b2620] transition-colors hover:bg-[#f6f0e0]"
    >
      <Icon name={service.icon} size={26} className="text-[#7a1f2b]" />
      <span className="mt-3 block text-xl font-bold leading-tight">{service.title}</span>
      <span className="mt-3 block text-[14px] leading-relaxed text-[#4a4237]">{service.description}</span>
      {(service.details ?? []).length > 0 && (
        <span className="mt-3 block space-y-1 text-[13px] text-[#5b5246]">
          {(service.details ?? []).map((detail) => (
            <span key={detail} className="block">— {detail}</span>
          ))}
        </span>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-[#7a1f2b] underline-offset-4 group-hover:underline">
        Read more
        <Icon name="arrow-up-right" size={14} />
      </span>
    </button>
  );
}

/** About board on the easel. */
export function AboutBoard({ heading, biography, specializations, portrait, layout = "screen" }: About & { layout?: ScreenLayout }) {
  const paragraphs = layout === "panel" ? biography : biography.slice(0, portrait ? 1 : 2);
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f1ead8] p-9 text-[#1d1a16]">
      <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[#7a1f2b]">
        <span className="h-px w-8 bg-[#7a1f2b]" /> ABOUT
      </p>
      {portrait && (
        <div className="relative mt-5 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm shadow-md">
          <Image src={portrait.src} alt={portrait.alt} fill sizes="580px" className="object-cover" style={{ objectPosition: portrait.focus }} />
        </div>
      )}
      <h3 className={cn("font-bold leading-tight tracking-tight", portrait ? "mt-5 text-2xl" : "mt-5 text-4xl")}>{heading}</h3>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#3d372f]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 pt-5 text-sm">
        {specializations.map((item) => (
          <li key={item.title} className="flex items-center gap-2">
            <Icon name={item.icon} size={15} className="text-[#7a1f2b]" />
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Phone home screen with contact channels. */
export function ContactPhoneScreen({ heading, email, socials, form }: Contact) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0d1f15] to-[#050807] px-5 pb-6 pt-10 text-white">
      <p className="text-center text-5xl font-semibold tracking-tight">Hi</p>
      <p className="mt-1 text-center text-sm text-white/60">{heading}</p>
      <div className="mt-8 space-y-3">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 hover:bg-white/15">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="mail" size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Email</span>
              <span className="block truncate text-xs text-white/60">{email}</span>
            </span>
          </a>
        )}
        {socials.map((link) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 hover:bg-white/15">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
              <Icon name={link.icon} size={18} />
            </span>
            <span className="text-sm font-semibold">{link.label}</span>
          </a>
        ))}
        {form && (
          <button type="button" data-open-contact="" className="flex w-full items-center justify-center rounded-2xl border border-primary/50 p-3 text-sm font-semibold text-primary">
            Send a message
          </button>
        )}
        {!email && socials.length === 0 && !form && (
          <p className="rounded-2xl border border-dashed border-white/20 p-4 text-center text-xs text-white/60">
            Add an email or social links in src/config to show contact options here.
          </p>
        )}
      </div>
    </div>
  );
}
