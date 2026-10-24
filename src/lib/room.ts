import "server-only";
import { aboutConfig } from "@/config/about";
import { contactConfig } from "@/config/contact";
import { experienceConfig } from "@/config/experience";
import { heroConfig } from "@/config/hero";
import { roomConfig } from "@/config/room";
import { siteConfig } from "@/config/site";
import { isContactFormAvailable } from "@/lib/contact-server";
import {
  getAboutContent,
  getExperienceCards,
  getPublicEmail,
  getResume,
  getServices,
  getSkillCategories,
  getSocialLinks,
} from "@/lib/content";
import { present, presentList } from "@/lib/placeholders";
import { getSectionProjects, toCardData } from "@/lib/projects";
import { publicFileExists } from "@/lib/public-files";
import { getRenderedSections, resolveCta } from "@/lib/sections";
import type { RoomData } from "@/types/room";

/** Builds everything the 3D room needs from configuration, server-side. */
export function buildRoomData(): RoomData {
  const rendered = new Set(getRenderedSections().map((section) => section.id));
  const has = (id: keyof typeof roomConfig.stations) => rendered.has(id) && Boolean(roomConfig.stations[id]);

  const stations = getRenderedSections().flatMap((section) => {
    const station = roomConfig.stations[section.id];
    return station ? [{ ...station, id: section.id, label: section.label }] : [];
  });

  const about = getAboutContent();
  const portrait = publicFileExists(heroConfig.portrait.src) ? heroConfig.portrait : undefined;
  const cta = resolveCta(heroConfig.primaryCta);

  return {
    stations,
    logo: siteConfig.shortName,
    hero: {
      greeting: present(heroConfig.greeting),
      name: present(heroConfig.headline) ?? siteConfig.name,
      title: heroConfig.title,
      roles: presentList(heroConfig.roles),
      roleInterval: heroConfig.roleInterval,
      intro: present(heroConfig.intro),
      specialties: presentList(heroConfig.specialties),
      cta: cta ? { label: cta.label, href: cta.href } : undefined,
      resume: heroConfig.showResumeButton ? getResume() : undefined,
      socials: heroConfig.showSocialLinks ? getSocialLinks({ hero: true }) : [],
      availability: heroConfig.availability.enabled ? present(heroConfig.availability.label) : undefined,
    },
    about: has("about")
      ? {
          heading: aboutConfig.heading,
          biography: about.biography,
          specializations: about.specializations,
          portrait,
        }
      : undefined,
    experience: has("experience")
      ? { cards: getExperienceCards(), presentLabel: experienceConfig.presentLabel }
      : undefined,
    skills: has("skills") ? { categories: getSkillCategories() } : undefined,
    projects: has("projects") ? { items: getSectionProjects().map(toCardData) } : undefined,
    services: has("services") ? { items: getServices() } : undefined,
    contact: has("contact")
      ? {
          heading: contactConfig.heading,
          intro: contactConfig.intro,
          email: getPublicEmail(),
          socials: getSocialLinks(),
          form: isContactFormAvailable() ? contactConfig.form : undefined,
        }
      : undefined,
  };
}
