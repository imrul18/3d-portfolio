"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { BookOpen, ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { roomConfig } from "@/config/room";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAllowMotion } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/utils";
import { supportsWebGL } from "@/lib/webgl";
import type { ServiceItem } from "@/types/content";
import type { ProjectCardData } from "@/types/project-card";
import type { RoomData } from "@/types/room";
import type { SectionId } from "@/types/site";
import { ContactForm } from "./ContactForm";
import { ProjectDetails } from "./ProjectDetails";
import { ServiceDetails } from "./ServiceDetails";
import { RoleTicker } from "./RoleTicker";
import { RoomDialog } from "./RoomDialog";
import RoomScene from "./RoomScene";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import {
  AboutBoard,
  ContactPhoneScreen,
  ExperienceScreen,
  ProjectsScreen,
  ServicePaperContent,
  SkillsScreen,
} from "./ScreenContent";

const READY_ATTR = "data-room-ready";
const { labels, neonColor } = roomConfig;

let webglSupport: boolean | undefined;
const subscribeNoop = () => () => {};
const getWebGL = () => (webglSupport ??= supportsWebGL());

interface RoomExperienceProps {
  data: RoomData;
}

/**
 * The whole site: a full-screen 3D room. The page scrolls normally over a tall
 * spacer and scroll position drives the camera between stations.
 */
export default function RoomExperience({ data }: RoomExperienceProps) {
  const webgl = useSyncExternalStore(subscribeNoop, getWebGL, () => true);
  const [failed, setFailed] = useState(false);

  // Reveal the page (hide the boot loader) when the room can't render.
  useEffect(() => {
    if (!webgl || failed) document.documentElement.setAttribute(READY_ATTR, "");
  }, [webgl, failed]);

  if (!webgl || failed) return <NoWebGL data={data} />;
  return (
    <SceneErrorBoundary onError={() => setFailed(true)}>
      <Room data={data} />
    </SceneErrorBoundary>
  );
}

function Room({ data }: RoomExperienceProps) {
  const { stations } = data;
  const count = Math.max(stations.length, 1);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [project, setProject] = useState<ProjectCardData>();
  const [service, setService] = useState<ServiceItem>();
  const [reading, setReading] = useState<SectionId>();
  const animate = useAllowMotion();
  const compact = useMediaQuery(`(max-width: ${roomConfig.compactWidth - 1}px)`);
  const activeIndex = Math.round(position);
  const active = stations[activeIndex];

  useEffect(() => () => document.documentElement.removeAttribute(READY_ATTR), []);

  // Station the room last came to rest at, and any scroll the room started itself.
  const settled = useRef(0);
  const autoScroll = useRef<{ target: number; until: number } | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      autoScroll.current = { target: index, until: Date.now() + 1600 };
      window.scrollTo({ top: (index / Math.max(count - 1, 1)) * max, behavior: animate ? "smooth" : "instant" });
    },
    [count, animate],
  );

  useEffect(() => {
    let frame = 0;
    let settleTimer = 0;
    let first = true;
    let touching = false;
    const { enabled: snapEnabled, threshold } = roomConfig.snap;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? (window.scrollY / max) * (count - 1) : 0;
      progress.current = value;
      setPosition(Math.round(value * 100) / 100);
      if (first) {
        first = false;
        settled.current = Math.round(value);
      }
    };

    /**
     * Runs once scrolling stops. Moving at least `threshold` of the way past
     * the resting station commits to the next one in that direction;
     * anything less eases back.
     */
    const settle = () => {
      if (touching) return; // wait until the finger lifts
      const p = progress.current;
      const auto = autoScroll.current;
      autoScroll.current = null;
      if (auto && (Math.abs(p - auto.target) < 0.02 || Date.now() > auto.until)) {
        settled.current = auto.target;
        return;
      }
      if (!snapEnabled) {
        settled.current = Math.round(p);
        return;
      }
      const delta = p - settled.current;
      let target = settled.current;
      if (delta > threshold) target = Math.floor(p - threshold) + 1;
      else if (delta < -threshold) target = Math.ceil(p + threshold) - 1;
      target = Math.min(count - 1, Math.max(0, target));
      if (Math.abs(p - target) < 0.005) settled.current = target;
      else goTo(target);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 140);
    };
    const onTouchStart = () => {
      touching = true;
      window.clearTimeout(settleTimer);
    };
    const onTouchEnd = () => {
      touching = false;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 140);
    };
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    // "Send a message" on the phone screen (rendered in a separate HTML root).
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("[data-open-contact]")) setContactOpen(true);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      document.removeEventListener("click", onClick);
    };
  }, [count, goTo]);

  const goToHref = (href: string) => {
    const index = stations.findIndex((station) => `#${station.id}` === href);
    if (index >= 0) goTo(index);
    else window.location.assign(href);
  };

  // "Discuss this" in a service popup: form, then email, then the contact station.
  const contact = data.contact;
  const contactIndex = stations.findIndex((station) => station.id === "contact");
  const canDiscuss = Boolean(contact?.form || contact?.email || contactIndex >= 0);
  const discuss = () => {
    setService(undefined);
    setReading(undefined);
    if (contact?.form) setContactOpen(true);
    else if (contact?.email) window.location.assign(`mailto:${contact.email}`);
    else if (contactIndex >= 0) goTo(contactIndex);
  };

  // How close we are to the nearest station: 1 at the station, 0 halfway.
  const nearness = 1 - Math.min(1, Math.abs(position - activeIndex) * 2.5);
  const heroVisible = active?.id === "hero" ? nearness : 0;
  const canRead = compact && active && active.id !== "hero" && nearness > 0.6;

  return (
    <div className="relative text-foreground" style={{ backgroundColor: roomConfig.palette.background }}>
      <div className="fixed inset-0 z-0">
        <Canvas
          dpr={compact ? [1, 1.25] : [1, 1.5]}
          camera={{ position: stations[0]?.camera ?? [6, 4, 8], fov: compact ? 50 : 45, near: 0.05, far: 80 }}
          gl={{ antialias: !compact, powerPreference: "high-performance" }}
          onCreated={() => {
            // Give the first frames a moment to settle before revealing.
            window.setTimeout(() => document.documentElement.setAttribute(READY_ATTR, ""), 600);
          }}
        >
          <RoomScene
            data={data}
            progress={progress}
            activeIndex={activeIndex}
            pointer={pointer}
            animate={animate}
            compact={compact}
            onOpenProject={setProject}
            onOpenService={setService}
          />
        </Canvas>
      </div>

      {/* Scroll track: one viewport per station */}
      <div aria-hidden="true" style={{ height: `${count * 100}svh` }} />

      {/* Logo */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center px-5 py-5 sm:px-10 sm:py-7">
        <button
          type="button"
          onClick={() => goTo(0)}
          className="pointer-events-auto text-xl font-bold tracking-tight text-white sm:text-2xl"
          aria-label="Back to start"
        >
          {data.logo.toLowerCase()}
          <span className="text-primary">.</span>
        </button>
      </div>

      <HeroOverlay data={data} visible={heroVisible} onCta={goToHref} />

      {/* Neon station title */}
      {stations.map((station, index) =>
        station.neon ? (
          <div
            key={station.id}
            aria-hidden={index !== activeIndex}
            className="pointer-events-none fixed inset-x-0 top-14 z-40 px-4 text-center transition-opacity duration-500 sm:top-6"
            style={{ opacity: index === activeIndex ? nearness : 0 }}
          >
            <h2
              className="font-neon text-[clamp(2.75rem,7vw,6.5rem)] font-normal leading-none tracking-normal"
              style={{
                color: "#fff",
                textShadow: `0 0 4px #fff, 0 0 12px ${neonColor}, 0 0 28px ${neonColor}, 0 0 60px ${neonColor}`,
              }}
            >
              {station.neon}
            </h2>
            {station.hint && !compact && (
              <p className="mx-auto mt-5 text-[11px] uppercase tracking-[0.35em] text-white/60">{station.hint}</p>
            )}
          </div>
        ) : null,
      )}

      {/* Side dots */}
      <nav aria-label="Room stations" className="fixed right-3 top-1/2 z-50 -translate-y-1/2 sm:right-8">
        <ul className="flex flex-col items-end gap-1 sm:gap-3">
          {stations.map((station, index) => (
            <li key={station.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={station.label}
                aria-current={index === activeIndex ? "step" : undefined}
                className="group flex min-h-9 items-center gap-3 sm:min-h-0"
              >
                <span
                  className={cn(
                    "hidden text-[11px] uppercase tracking-[0.3em] transition-opacity sm:inline",
                    index === activeIndex ? "text-white opacity-100" : "text-white/70 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {station.label}
                </span>
                <span
                  className={cn(
                    "size-3 rounded-full border transition-all sm:size-3.5",
                    index === activeIndex ? "border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" : "border-white/60 group-hover:border-white",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phones: open the current station's content in a readable panel */}
      {canRead && (
        <button
          type="button"
          onClick={() => setReading(active.id)}
          className="fixed bottom-20 left-1/2 z-50 inline-flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <BookOpen size={17} aria-hidden="true" />
          {labels.read} {active.label}
        </button>
      )}

      {/* Scroll cue */}
      {activeIndex < count - 1 && (
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] uppercase tracking-[0.35em] text-white/60 hover:text-white sm:bottom-7"
        >
          {labels.scroll}
          <ChevronDown size={18} className="animate-bounce motion-reduce:animate-none" aria-hidden="true" />
        </button>
      )}

      {reading && (
        <RoomDialog
          open
          variant="panel"
          onClose={() => setReading(undefined)}
          title={stations.find((station) => station.id === reading)?.neon ?? reading}
        >
          <StationPanel id={reading} data={data} onOpenProject={setProject} onOpenService={setService} />
        </RoomDialog>
      )}

      {project && (
        <RoomDialog open onClose={() => setProject(undefined)} title={project.name} subtitle={project.shortDescription}>
          <ProjectDetails project={project} />
        </RoomDialog>
      )}

      {service && (
        <RoomDialog open onClose={() => setService(undefined)} title={service.title}>
          <ServiceDetails
            service={service}
            discussLabel={labels.discuss}
            onDiscuss={canDiscuss ? discuss : undefined}
          />
        </RoomDialog>
      )}

      {data.contact?.form && (
        <RoomDialog open={contactOpen} onClose={() => setContactOpen(false)} title={data.contact.heading} subtitle={data.contact.intro}>
          <div className="p-6">
            <ContactForm {...data.contact.form} fallbackEmail={data.contact.email} />
          </div>
        </RoomDialog>
      )}
    </div>
  );
}

/** Name, title and intro over the opening view. */
function HeroOverlay({ data, visible, onCta }: { data: RoomData; visible: number; onCta: (href: string) => void }) {
  const { hero } = data;
  const interactive = visible > 0.5 ? "pointer-events-auto" : "pointer-events-none";
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between px-5 pb-24 pt-20 transition-opacity duration-500 sm:px-14 sm:pb-14 sm:pt-28"
      style={{ opacity: visible }}
      aria-hidden={visible < 0.5}
    >
      <div>
        {hero.greeting && (
          <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
            <span className="h-px w-12 bg-primary" />
            {hero.greeting}
          </p>
        )}
        <h1 className="mt-3 max-w-4xl text-[clamp(2.6rem,7vw,7rem)] font-bold leading-[0.95] tracking-tight text-white">
          {hero.name}
        </h1>
        <p className="mt-4 text-lg font-medium text-primary sm:mt-5 sm:text-xl">{hero.title}</p>
        {hero.roles.length > 0 && (
          <RoleTicker
            roles={hero.roles}
            interval={hero.roleInterval}
            paused={visible < 0.1}
            className="mt-2 text-lg font-medium text-white/85 sm:text-xl"
          />
        )}
        {hero.availability && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span aria-hidden="true" className="animate-pulse-dot size-2 rounded-full bg-success" />
            {hero.availability}
          </p>
        )}
      </div>
      <div className="max-w-lg">
        {hero.intro && <p className="text-sm leading-relaxed text-white/80">{hero.intro}</p>}
        {hero.specialties.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {hero.specialties.map((item) => (
              <li key={item} className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-wide text-white/80 backdrop-blur">
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {hero.cta && (
            <button
              type="button"
              onClick={() => onCta(hero.cta?.href ?? "")}
              className={cn("rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow", interactive)}
            >
              {hero.cta.label}
            </button>
          )}
          {hero.resume && (
            <a href={hero.resume.url} download className={cn("inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2.5 text-sm font-medium text-primary", interactive)}>
              <Icon name="download" size={15} />
              {hero.resume.label}
            </a>
          )}
          {hero.socials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={link.label}
              className={cn("inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 hover:border-primary hover:text-primary", interactive)}
            >
              <Icon name={link.icon} size={17} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A station's content laid out for the full-screen reading panel (phones). */
function StationPanel({
  id,
  data,
  onOpenProject,
  onOpenService,
}: {
  id: SectionId;
  data: RoomData;
  onOpenProject: (project: ProjectCardData) => void;
  onOpenService: (service: ServiceItem) => void;
}) {
  switch (id) {
    case "about":
      return data.about ? <AboutBoard {...data.about} layout="panel" /> : null;
    case "experience":
      return data.experience ? <ExperienceScreen {...data.experience} logo={data.logo} layout="panel" /> : null;
    case "skills":
      return data.skills ? <SkillsScreen {...data.skills} /> : null;
    case "projects":
      return data.projects ? <ProjectsScreen {...data.projects} onOpen={onOpenProject} layout="panel" /> : null;
    case "services":
      return data.services ? (
        <div className="space-y-4 bg-[#1a1712] p-4">
          {data.services.items.map((service) => (
            <div key={service.id} className="overflow-hidden rounded-sm shadow-md">
              <ServicePaperContent service={service} onOpen={onOpenService} />
            </div>
          ))}
        </div>
      ) : null;
    case "contact":
      return data.contact ? (
        <div className="min-h-full">
          <ContactPhoneScreen {...data.contact} />
        </div>
      ) : null;
    case "hero":
      return null;
  }
}

/** Shown instead of the room when the browser can't render WebGL. */
function NoWebGL({ data }: RoomExperienceProps) {
  const contact = data.contact;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">{data.hero.name}</h1>
      <p className="text-lg text-primary">{data.hero.title}</p>
      <p className="max-w-md text-muted">{labels.noWebgl}</p>
      {contact && (contact.email || contact.socials.length > 0) && (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Icon name="mail" size={16} />
              {contact.email}
            </a>
          )}
          {contact.socials.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer me" className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/60 px-5 text-sm text-primary">
              <Icon name={link.icon} size={16} />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
