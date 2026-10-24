import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { themeConfig } from "@/config/theme";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social sharing image generated from site and theme configuration. */
export default function OpenGraphImage() {
  const colors = themeConfig.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `radial-gradient(circle at 85% 20%, ${colors.primary}33, transparent 45%), radial-gradient(circle at 75% 85%, ${colors.secondary}33, transparent 40%), ${colors.background}`,
          color: colors.foreground,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: colors.muted }}>{siteConfig.title}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
            {siteConfig.name}
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: colors.muted, maxWidth: 900 }}>
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
