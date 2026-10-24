import type { SiteConfig } from "@/types/site";

export type { SectionId } from "@/types/site";

/**
 * Personal details and the section list. Each enabled section becomes a stop
 * along the camera path in the 3D room, in `order`.
 *
 * Placeholder convention: any string that starts with "TODO" is treated as
 * missing content. See `placeholders` below.
 */
export const siteConfig: SiteConfig = {
  name: "Imrul Afnan",
  shortName: "Afnan",
  title: "Full-Stack Software Developer",
  description:
    "Building scalable web applications, mobile experiences, real-time systems, and AI-powered solutions.",

  // Production origin, e.g. "https://your-domain.com". Can also be set with
  // the NEXT_PUBLIC_SITE_URL environment variable.
  url: "",
  locale: "en",

  resume: {
    enabled: false,
    url: "/resume/resume.pdf",
    label: "Download resume",
  },

  placeholders: "auto",

  sections: [
    { id: "hero", label: "Home", enabled: true, order: 1 },
    { id: "about", label: "About", enabled: true, order: 2 },
    { id: "experience", label: "Experience", enabled: true, order: 3 },
    { id: "skills", label: "Skills", enabled: true, order: 4 },
    { id: "projects", label: "Work", enabled: true, order: 5 },
    { id: "services", label: "Services", enabled: true, order: 6 },
    { id: "contact", label: "Contact", enabled: true, order: 7 },
  ],
};
