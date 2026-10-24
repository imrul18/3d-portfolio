import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "Must be empty, a /public path or an http(s) URL",
  })
  .optional();

const yearMonth = z
  .string()
  .regex(/^\d{4}(-\d{2})?$/, "Use YYYY or YYYY-MM")
  .optional();

export const projectImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case"),
  name: z.string().min(1),
  shortDescription: z.string().default(""),
  fullDescription: z.string().default(""),
  coverImage: projectImageSchema.optional(),
  gallery: z.array(projectImageSchema).default([]),
  technologies: z.array(z.string()).default([]),
  category: z.string().min(1),
  role: z.string().optional(),
  features: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  liveUrl: optionalUrl,
  sourceUrl: optionalUrl,
  /** Open a details popup when the project is clicked on the TV. */
  details: z.boolean().default(true),
  /** Unpublished projects stay in the data file but never render. */
  published: z.boolean().default(true),
  startDate: yearMonth,
  endDate: yearMonth,
});

export const projectsFileSchema = z.object({
  projects: z.array(projectSchema),
});

export type ProjectImage = z.infer<typeof projectImageSchema>;
export type Project = z.infer<typeof projectSchema>;

export interface ProjectCategory {
  id: string;
  label: string;
}

export interface ProjectsSectionConfig {
  /** Categories in display order. Projects reference `id`. */
  categories: ProjectCategory[];
  /** Show only featured projects on the TV. */
  featuredOnly: boolean;
}
