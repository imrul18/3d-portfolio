import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RoomBootLoader } from "@/components/room/RoomBootLoader";
import { roomConfig } from "@/config/room";
import { siteConfig } from "@/config/site";
import { themeConfig } from "@/config/theme";
import { fontVariables } from "@/lib/fonts";
import { buildRootMetadata } from "@/lib/seo";
import { buildThemeCss } from "@/lib/theme-css";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: roomConfig.palette.background,
  colorScheme: "dark",
};

/** Without JavaScript the loader would never finish, so hide it. */
const NO_SCRIPT_CSS = "#room-boot{display:none!important}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.locale} className={fontVariables}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss(themeConfig) }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_CSS }} />
        </noscript>
      </head>
      <body className="min-h-svh antialiased" style={{ backgroundColor: roomConfig.palette.background }}>
        {children}
        <RoomBootLoader />
      </body>
    </html>
  );
}
