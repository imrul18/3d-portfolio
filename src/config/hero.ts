import type { HeroConfig } from "@/types/content";

/** The room's opening view (the "hero" station). */
export const heroConfig: HeroConfig = {
  greeting: "Hi, I'm",
  // headline: defaults to siteConfig.name
  title: "Full-Stack Software Developer",
  roles: [
    "Mobile App Developer",
    "Backend Developer",
    "Frontend Developer",
    "Real-Time Systems Engineer",
    "AI Integration Developer",
    "Technical Lead",
  ],
  roleInterval: 2400,
  intro:
    "I design and build products end to end: Laravel and PHP back ends, React and Vue front ends, native and cross-platform mobile apps, and the real-time and AI features that tie them together.",
  specialties: [
    "scalable web applications",
    "mobile experiences",
    "real-time systems",
    "AI-powered solutions",
  ],

  primaryCta: { label: "View my work", href: "#projects" },
  showResumeButton: true, // also requires siteConfig.resume.enabled
  showSocialLinks: true,
  availability: { enabled: false, label: "Available for new projects" },

  portrait: {
    src: "/images/profile.jpg",
    alt: "Md. Imrul Hosen Afnan in a navy suit and sunglasses",
    focus: "50% 20%",
  },
};
