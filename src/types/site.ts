import type { IconName } from "./icon";

/** Every section the room knows how to show. */
export const SECTION_IDS = ["hero", "about", "experience", "skills", "projects", "services", "contact"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface SectionConfig {
  id: SectionId;
  /** Name shown beside the side dots in the room. */
  label: string;
  enabled: boolean;
  /** Lower numbers come first along the camera path. */
  order: number;
  /**
   * Skip the section when it has no publishable content (e.g. only TODO
   * placeholders in production). Defaults to `true`.
   */
  hideWhenEmpty?: boolean;
}

export interface ResumeConfig {
  enabled: boolean;
  /** Path under `/public` (e.g. `/resume/afnan-resume.pdf`) or an absolute URL. */
  url: string;
  label?: string;
}

/**
 * How placeholder values (strings starting with "TODO") are treated.
 * - `auto`: visible in development so you can find them, hidden in production.
 * - `show`: always visible.
 * - `hide`: always hidden.
 */
export type PlaceholderMode = "auto" | "show" | "hide";

export interface SiteConfig {
  name: string;
  /** Short name used as the logo, e.g. "Afnan". */
  shortName: string;
  title: string;
  description: string;
  /** Production origin, e.g. `https://afnan.dev`. Leave empty until you have one. */
  url: string;
  locale: string;
  resume: ResumeConfig;
  placeholders: PlaceholderMode;
  sections: SectionConfig[];
}

export interface SocialLink {
  /** Stable identifier, also used as React key. */
  id: string;
  label: string;
  url: string;
  icon: IconName;
  /** Set to false to keep the entry in config without publishing it. */
  enabled: boolean;
  /** Also show in the room's opening view. Defaults to true. */
  showInHero?: boolean;
}

export interface CallToAction {
  label: string;
  /** A section anchor like "#projects" (moves the camera) or a URL. */
  href: string;
  enabled?: boolean;
}
