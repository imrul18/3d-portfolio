import "server-only";
import { siteConfig } from "@/config/site";
import { isContactFormAvailable } from "@/lib/contact-server";
import {
  getAboutContent,
  getExperienceCards,
  getPublicEmail,
  getServices,
  getSkillCategories,
  getSocialLinks,
} from "@/lib/content";
import { getSectionProjects } from "@/lib/projects";
import type { SectionConfig, SectionId } from "@/types/site";

/** Whether each section has anything publishable to show. */
const sectionHasContent: Record<SectionId, () => boolean> = {
  hero: () => true,
  about: () => {
    const about = getAboutContent();
    return about.biography.length > 0 || about.specializations.length > 0;
  },
  experience: () => getExperienceCards().length > 0,
  skills: () => getSkillCategories().length > 0,
  projects: () => getSectionProjects().length > 0,
  services: () => getServices().length > 0,
  contact: () =>
    Boolean(getPublicEmail()) ||
    getSocialLinks().length > 0 ||
    isContactFormAvailable() ||
    process.env.NODE_ENV === "development",
};

/** Enabled sections in display order, honoring `hideWhenEmpty`. */
export function getRenderedSections(): SectionConfig[] {
  return siteConfig.sections
    .filter((section) => section.enabled)
    .filter((section) => section.hideWhenEmpty === false || sectionHasContent[section.id]())
    .slice()
    .sort((a, b) => a.order - b.order);
}

/**
 * Drops calls to action that point at a section which isn't shown, so
 * buttons never lead nowhere.
 */
export function resolveCta<T extends { href: string; enabled?: boolean }>(cta: T | undefined): T | undefined {
  if (!cta || cta.enabled === false) return undefined;
  if (!cta.href.startsWith("#")) return cta;
  const target = cta.href.slice(1);
  return getRenderedSections().some((section) => section.id === target) ? cta : undefined;
}
