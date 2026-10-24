import { siteConfig } from "@/config/site";

const PLACEHOLDER_PREFIX = "TODO";

export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trimStart().startsWith(PLACEHOLDER_PREFIX);
}

/** Whether placeholder values should currently be rendered. */
export function placeholdersVisible(): boolean {
  switch (siteConfig.placeholders) {
    case "show":
      return true;
    case "hide":
      return false;
    case "auto":
      return process.env.NODE_ENV === "development";
  }
}

/**
 * Returns the value if it is publishable: non-empty and either real content
 * or a placeholder while placeholders are visible.
 */
export function present(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (isPlaceholder(trimmed) && !placeholdersVisible()) return undefined;
  return trimmed;
}

/** Filters a list down to publishable values. */
export function presentList(values: readonly string[] | undefined): string[] {
  return (values ?? []).flatMap((value) => {
    const kept = present(value);
    return kept ? [kept] : [];
  });
}
