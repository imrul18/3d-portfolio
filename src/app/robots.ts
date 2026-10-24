import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    rules: seoConfig.index
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : { userAgent: "*", disallow: "/" },
    ...(sitemap && seoConfig.index && { sitemap }),
  };
}
