import type { ServiceItem } from "@/types/content";

/** Typed onto papers on the coffee table (up to seven). */
export const services: ServiceItem[] = [
  {
    id: "full-stack",
    title: "Full-stack web development",
    description:
      "Complete web applications, from database design and APIs to responsive, accessible interfaces.",
    icon: "layers",
    details: ["Laravel and PHP back ends", "React, Vue, Next.js and Nuxt front ends"],
    enabled: true,
  },
  {
    id: "mobile",
    title: "Mobile app development",
    description:
      "Native and cross-platform apps for Android and iOS that share logic with your web platform.",
    icon: "smartphone",
    details: ["React Native and Expo", "Kotlin, Jetpack Compose, Swift and Flutter"],
    enabled: true,
  },
  {
    id: "api",
    title: "API development and integration",
    description:
      "Well-structured REST APIs and integrations with the third-party services your product depends on.",
    icon: "plug",
    enabled: true,
  },
  {
    id: "realtime",
    title: "Real-time applications",
    description:
      "Live updates, chat, tracking and dashboards built on WebSockets and Redis.",
    icon: "radio",
    enabled: true,
  },
  {
    id: "performance",
    title: "Performance optimization",
    description:
      "Profiling slow queries, pages and endpoints, then fixing what actually moves the numbers.",
    icon: "gauge",
    enabled: true,
  },
  {
    id: "consulting",
    title: "Technical consulting",
    description:
      "Architecture reviews, technology choices and hands-on guidance for engineering teams.",
    icon: "lightbulb",
    enabled: true,
  },
  {
    id: "ai",
    title: "AI integration and automation",
    description:
      "Adding AI features to products and automating repetitive workflows with AI tooling.",
    icon: "bot",
    enabled: true,
  },
];
