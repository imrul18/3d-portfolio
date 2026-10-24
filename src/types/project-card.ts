import type { ProjectImage } from "./project";

/** Serializable, display-ready project data passed to the room. */
export interface ProjectCardData {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  category: string;
  categoryLabel: string;
  coverImage?: ProjectImage;
  gallery: ProjectImage[];
  technologies: string[];
  features: string[];
  challenges: string[];
  role?: string;
  /** Formatted date range, if dates are set. */
  period?: string;
  featured: boolean;
  liveUrl?: string;
  sourceUrl?: string;
  /** Whether clicking the project opens a details popup. */
  hasDetails: boolean;
}
