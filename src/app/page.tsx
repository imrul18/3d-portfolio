import { RoomMount } from "@/components/room/RoomMount";
import { roomConfig } from "@/config/room";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildRoomData } from "@/lib/room";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <main>
      {seoConfig.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd()) }}
        />
      )}
      <noscript>
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
          <h1 className="text-4xl font-bold text-white">{siteConfig.name}</h1>
          <p className="text-lg text-primary">{siteConfig.title}</p>
          <p className="max-w-md text-muted">{roomConfig.labels.noScript}</p>
        </div>
      </noscript>
      <RoomMount data={buildRoomData()} />
    </main>
  );
}
