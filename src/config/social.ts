import type { SocialLink } from "@/types/site";

/**
 * Social profiles. Replace the URLs with your own and set `enabled: true`.
 * Disabled links, and links whose URL is empty, never render.
 */
export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", url: "", icon: "github", enabled: false },
  { id: "linkedin", label: "LinkedIn", url: "", icon: "linkedin", enabled: false },
  { id: "x", label: "X", url: "", icon: "x", enabled: false },
];
