import type { ThemeConfig } from "@/types/theme";

function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/** Serializes theme tokens into CSS custom properties on `:root`. */
export function buildThemeCss(theme: ThemeConfig): string {
  const declarations = [
    "color-scheme:dark;",
    ...Object.entries(theme.colors).map(([key, value]) => `--${toKebab(key)}:${value};`),
    ...Object.entries(theme.shadows).map(([key, value]) => `--elev-${key}:${value};`),
    ...Object.entries(theme.radii).map(([key, value]) => `--r-${key}:${value};`),
    `--display-tracking:${theme.typography.displayTracking};`,
    `--display-weight:${theme.typography.displayWeight};`,
    `--body-line-height:${theme.typography.bodyLineHeight};`,
  ];
  return `:root{${declarations.join("")}}`;
}
