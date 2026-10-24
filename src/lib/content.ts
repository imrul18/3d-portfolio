/**
 * Content selectors: turn raw configuration into what the room should show,
 * dropping disabled entries and unpublished placeholders in one place.
 */
import { aboutConfig } from "@/config/about";
import { contactConfig } from "@/config/contact";
import { experienceConfig } from "@/config/experience";
import { services } from "@/config/services";
import { siteConfig } from "@/config/site";
import { skillsConfig } from "@/config/skills";
import { socialLinks } from "@/config/social";
import { present, presentList } from "@/lib/placeholders";
import type { ExperienceCard, ExperienceRole } from "@/types/experience";
import type { SkillCategory } from "@/types/skill";

export function getSocialLinks(options: { hero?: boolean } = {}) {
  return socialLinks.filter(
    (link) =>
      link.enabled && Boolean(present(link.url)) && (!options.hero || link.showInHero !== false),
  );
}

/**
 * Experience cards, one per enabled company, in config order. Roles with
 * placeholder titles (outside development) or `enabled: false` are dropped,
 * and a company with no roles left is skipped.
 */
export function getExperienceCards(): ExperienceCard[] {
  return experienceConfig.companies.flatMap((company) => {
    if (!company.enabled || !present(company.company)) return [];
    const roles: ExperienceRole[] = company.roles
      .filter((role) => role.enabled !== false && present(role.title))
      .map((role) => ({
        ...role,
        description: present(role.description),
        responsibilities: presentList(role.responsibilities),
        achievements: presentList(role.achievements),
        technologies: presentList(role.technologies),
      }));
    if (roles.length === 0) return [];

    const currentlyWorking = roles.some((role) => role.currentlyWorking);
    const ends = roles.flatMap((role) => (!role.currentlyWorking && role.endDate ? [role.endDate] : []));
    return [
      {
        id: company.id,
        company: company.company,
        companyUrl: present(company.companyUrl),
        employmentType: company.employmentType,
        location: company.location,
        currentlyWorking,
        startDate: roles.map((role) => role.startDate).sort()[0],
        endDate: currentlyWorking ? undefined : ends.sort().at(-1),
        roles,
        technologies: [...new Set(roles.flatMap((role) => role.technologies ?? []))],
      },
    ];
  });
}

export function getSkillCategories(): SkillCategory[] {
  return skillsConfig.categories.filter((category) => category.enabled && category.skills.length > 0);
}

export function getServices() {
  return services
    .filter((item) => item.enabled && present(item.title))
    .map((item) => ({ ...item, details: presentList(item.details) }));
}

export function getAboutContent() {
  return {
    biography: presentList(aboutConfig.biography),
    specializations: aboutConfig.specializations.filter((s) => present(s.title)),
  };
}

/** The public email address, or undefined when publishing is not enabled. */
export function getPublicEmail(): string | undefined {
  if (!contactConfig.publishEmail) return undefined;
  const email = present(contactConfig.email);
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
}

export function getResume() {
  const { resume } = siteConfig;
  const url = present(resume.url);
  return resume.enabled && url ? { url, label: resume.label ?? "Download resume" } : undefined;
}
