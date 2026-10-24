import type { Metadata } from "next";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { skillsConfig } from "@/config/skills";
import { getPublicEmail, getSocialLinks } from "@/lib/content";

/** The configured production origin without a trailing slash, if any. */
export function getSiteUrl(): string | undefined {
  const raw = siteConfig.url || process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!/^https?:\/\//.test(raw)) return undefined;
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  return /^https?:\/\//.test(path) ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: { default: seoConfig.title, template: seoConfig.titleTemplate },
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteUrl }],
    creator: siteConfig.name,
    alternates: siteUrl ? { canonical: "/" } : undefined,
    robots: seoConfig.index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteUrl,
      siteName: siteConfig.name,
      title: seoConfig.title,
      description: seoConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.title,
      description: seoConfig.description,
      creator: seoConfig.twitterHandle || undefined,
    },
  };
}

/** schema.org Person data built only from configured, publishable values. */
export function buildPersonJsonLd() {
  const siteUrl = getSiteUrl();
  const sameAs = getSocialLinks().map((link) => link.url);
  const email = getPublicEmail();
  const knowsAbout = skillsConfig.categories
    .filter((category) => category.enabled)
    .flatMap((category) => category.skills);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    description: siteConfig.description,
    ...(siteUrl && { url: siteUrl }),
    ...(email && { email: `mailto:${email}` }),
    ...(sameAs.length > 0 && { sameAs }),
    knowsAbout,
  };
}

/** JSON for a `<script type="application/ld+json">`, escaped against injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
