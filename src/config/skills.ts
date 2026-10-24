import type { SkillsSectionConfig } from "@/types/skill";

/** Shown on the laptop. Categories and skills render in the order listed here. */
export const skillsConfig: SkillsSectionConfig = {
  categories: [
    {
      id: "backend",
      label: "Backend",
      icon: "server",
      skills: ["PHP", "Laravel", "Node.js"],
      enabled: true,
    },
    {
      id: "frontend",
      label: "Frontend",
      icon: "layout",
      skills: ["React", "Vue", "Next.js", "Nuxt", "JavaScript", "TypeScript"],
      enabled: true,
    },
    {
      id: "mobile",
      label: "Mobile",
      icon: "smartphone",
      skills: ["React Native", "Expo", "Kotlin", "Jetpack Compose", "Swift", "Flutter"],
      enabled: true,
    },
    {
      id: "data",
      label: "Databases & APIs",
      icon: "database",
      skills: ["MySQL", "Redis", "REST APIs", "WebSockets"],
      enabled: true,
    },
    {
      id: "devops",
      label: "DevOps & Infrastructure",
      icon: "cloud",
      skills: ["Git", "AWS S3"],
      enabled: true,
    },
    {
      id: "ai",
      label: "AI & Automation",
      icon: "bot",
      skills: ["AI development tools"],
      enabled: true,
    },
  ],
};
