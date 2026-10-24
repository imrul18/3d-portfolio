import type { ProjectsSectionConfig } from "@/types/project";

/**
 * Settings for the projects shown on the TV. Project entries live in
 * `src/data/projects.json` and are validated at build time by
 * `src/lib/projects.ts`.
 */
export const projectsConfig: ProjectsSectionConfig = {
  categories: [
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "platform", label: "Platforms & systems" },
  ],
  featuredOnly: false,
};
