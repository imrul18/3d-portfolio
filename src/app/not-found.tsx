import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-neon text-[clamp(5rem,16vw,10rem)] leading-none text-white [text-shadow:0_0_12px_#ff2d55,0_0_40px_#ff2d55]">
        404
      </p>
      <h1 className="mt-6 text-3xl font-bold text-foreground">This page doesn&apos;t exist</h1>
      <p className="mt-3 max-w-md text-muted">The link may be broken or the page may have moved.</p>
      <LinkButton href="/" size="lg" icon="arrow-right" trailingIcon className="mt-8">
        Back to the room
      </LinkButton>
    </main>
  );
}
