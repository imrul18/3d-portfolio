type ClassValue = string | false | null | undefined;

/** Joins truthy class names. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Attributes for links that leave the site. */
export function externalLinkProps(href: string) {
  return /^https?:\/\//.test(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

/** Initials for generated artwork, e.g. "Pioneer Tours" → "PT". */
export function initials(name: string, max = 2): string {
  return name
    .split(/[\s-]+/)
    .filter((part) => /[\p{L}\p{N}]/u.test(part))
    .slice(0, max)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Small deterministic hash used to vary generated artwork per item. */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
