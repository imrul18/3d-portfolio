import Image from "next/image";
import { cn, hashString, initials } from "@/lib/utils";
import type { ProjectImage } from "@/types/project";

interface ProjectCoverProps {
  name: string;
  image?: ProjectImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * The project's cover image, or generated artwork derived from its name
 * when no image is configured.
 */
export function ProjectCover({ name, image, className, sizes, priority }: ProjectCoverProps) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-strong", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          preload={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const hash = hashString(name);
  const angle = hash % 360;
  const shiftX = 20 + (hash % 60);
  const shiftY = 15 + ((hash >> 3) % 55);

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden bg-surface-strong", className)}
      style={{
        backgroundImage: `radial-gradient(circle at ${shiftX}% ${shiftY}%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 55%), radial-gradient(circle at ${100 - shiftX}% ${100 - shiftY}%, color-mix(in oklab, var(--secondary) 45%, transparent), transparent 50%), linear-gradient(${angle}deg, color-mix(in oklab, var(--primary) 30%, var(--surface-strong)), var(--surface-strong))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />
      <span className="absolute bottom-3 right-5 font-display text-[clamp(3.5rem,9vw,6rem)] font-semibold leading-none tracking-tighter text-foreground/15 transition-transform duration-700 ease-out group-hover:-translate-y-1">
        {initials(name)}
      </span>
    </div>
  );
}
