import rawProjects from "@/data/projects.json";
import { projectsConfig } from "@/config/projects";
import { formatRange } from "@/lib/dates";
import { present, presentList } from "@/lib/placeholders";
import { projectsFileSchema, type Project } from "@/types/project";
import type { ProjectCardData } from "@/types/project-card";

function loadProjects(): Project[] {
  const result = projectsFileSchema.safeParse(rawProjects);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid src/data/projects.json:\n${issues}`);
  }

  const projects = result.data.projects;
  const seen = new Set<string>();
  for (const project of projects) {
    if (seen.has(project.slug)) throw new Error(`Duplicate project slug "${project.slug}"`);
    seen.add(project.slug);
  }
  return projects;
}

const allProjects = loadProjects();

/** Published projects, ordered by `order` then name. */
export function getProjects(): Project[] {
  return allProjects
    .filter((project) => project.published)
    .slice()
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/** Projects shown on the TV. */
export function getSectionProjects(): Project[] {
  const projects = getProjects();
  return projectsConfig.featuredOnly ? projects.filter((p) => p.featured) : projects;
}

export function getCategoryLabel(id: string): string {
  return projectsConfig.categories.find((category) => category.id === id)?.label ?? id;
}

/** Display-ready, serializable project data for the room. */
export function toCardData(project: Project): ProjectCardData {
  const fullDescription = present(project.fullDescription);
  const shortDescription = present(project.shortDescription);
  const features = presentList(project.features);
  const challenges = presentList(project.challenges);
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortDescription,
    fullDescription,
    category: project.category,
    categoryLabel: getCategoryLabel(project.category),
    coverImage: project.coverImage,
    gallery: project.gallery,
    technologies: presentList(project.technologies),
    features,
    challenges,
    role: present(project.role),
    period:
      project.startDate || project.endDate ? formatRange(project.startDate, project.endDate, "Ongoing") : undefined,
    featured: project.featured,
    liveUrl: present(project.liveUrl),
    sourceUrl: present(project.sourceUrl),
    hasDetails: project.details && Boolean(fullDescription ?? shortDescription ?? features[0]),
  };
}
