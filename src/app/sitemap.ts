import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** The site is a single page. Empty until a site URL is configured. */
export default function sitemap(): MetadataRoute.Sitemap {
  const home = absoluteUrl("/");
  return home ? [{ url: home, changeFrequency: "monthly", priority: 1 }] : [];
}
