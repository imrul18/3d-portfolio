import type { AboutConfig, ServiceItem } from "./content";
import type { ExperienceCard } from "./experience";
import type { ProjectCardData } from "./project-card";
import type { SectionId, SocialLink } from "./site";
import type { SkillCategory } from "./skill";

export type Vec3 = [number, number, number];

/** Where the camera sits for a section, and the copy shown while it's there. */
export interface StationConfig {
  camera: Vec3;
  target: Vec3;
  /** Neon sign text shown above the station. */
  neon?: string;
  /** Small hint shown on the right while at this station. */
  hint?: string;
}

export interface RoomConfig {
  /**
   * Screens narrower than this use the compact layout: smaller overlays, and
   * a "Read" button that opens each station's content in a full-screen panel.
   */
  compactWidth: number;
  neonColor: string;
  /** Material colors for the room's furniture and lighting. */
  palette: {
    background: string;
    floor: string;
    floorLines: string;
    wall: string;
    furniture: string;
    furnitureLight: string;
    accent: string;
    led: string;
    screen: string;
    wood: string;
    paper: string;
    fan: string;
  };
  loader: { title: string; message: string };
  /**
   * Scroll snapping between stations. When scrolling stops, the room moves to
   * the next station if you scrolled at least `threshold` (a fraction, 0.1 =
   * 10%) of the way there, and otherwise returns to the current one.
   */
  snap: { enabled: boolean; threshold: number };
  labels: {
    scroll: string;
    read: string;
    /** Button in a service popup that leads to the contact options. */
    discuss: string;
    noWebgl: string;
    noScript: string;
  };
  /**
   * Camera stops per section, in the order of `siteConfig.sections`. A section
   * without an entry here (or disabled in `site.ts`) is skipped.
   */
  stations: Partial<Record<SectionId, StationConfig>>;
}

/** Serializable content the server hands to the client-only room. */
export interface RoomData {
  stations: (StationConfig & { id: SectionId; label: string })[];
  hero: {
    greeting?: string;
    name: string;
    title: string;
    roles: string[];
    roleInterval: number;
    intro?: string;
    specialties: string[];
    cta?: { label: string; href: string };
    resume?: { url: string; label: string };
    socials: SocialLink[];
    availability?: string;
  };
  about?: {
    heading: string;
    biography: string[];
    specializations: AboutConfig["specializations"];
    portrait?: { src: string; alt: string; focus?: string };
  };
  experience?: { cards: ExperienceCard[]; presentLabel: string };
  skills?: { categories: SkillCategory[] };
  projects?: { items: ProjectCardData[] };
  services?: { items: ServiceItem[] };
  contact?: {
    heading: string;
    intro: string;
    email?: string;
    socials: SocialLink[];
    /** Present when the contact form is configured; opens in a popup over the room. */
    form?: { submitLabel: string; successMessage: string; errorMessage: string };
  };
  logo: string;
}
