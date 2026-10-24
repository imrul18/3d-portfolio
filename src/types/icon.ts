/**
 * Every icon that configuration files may reference by name.
 * The icon registry in `src/components/ui/Icon.tsx` must provide a
 * component for each entry, which TypeScript enforces.
 */
export const ICON_NAMES = [
  // Brands
  "github",
  "linkedin",
  "x",
  "facebook",
  "instagram",
  "youtube",
  "dribbble",
  "medium",
  "devto",
  "stackoverflow",
  // General
  "mail",
  "phone",
  "map-pin",
  "globe",
  "link",
  "file-text",
  "download",
  "arrow-right",
  "arrow-up-right",
  "calendar",
  "briefcase",
  "sparkles",
  // Disciplines
  "server",
  "layout",
  "smartphone",
  "database",
  "cloud",
  "bot",
  "code",
  "plug",
  "radio",
  "gauge",
  "lightbulb",
  "layers",
  "cpu",
  "shield",
  "rocket",
  "users",
  "workflow",
  "terminal",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
