import type { AboutConfig } from "@/types/content";

/**
 * Shown on the easel in the room. Strings that start with "TODO" are hidden
 * in production.
 */
export const aboutConfig: AboutConfig = {
  heading: "Engineering products from database to device",
  biography: [
    "I'm Md. Imrul Hosen Afnan, a full-stack software developer and technical lead. I work across the whole stack: PHP and Laravel services, React, Vue, Next.js and Nuxt interfaces, and mobile apps in React Native, Kotlin with Jetpack Compose, Swift and Flutter.",
    "Much of my work involves systems that have to stay fast and in sync: REST and WebSocket APIs, MySQL and Redis data layers, media storage on AWS S3, and AI tooling built into everyday workflows.",
  ],
  specializations: [
    {
      title: "Web applications",
      icon: "layout",
      description: "Laravel, React, Vue, Next.js and Nuxt.",
    },
    {
      title: "Mobile experiences",
      icon: "smartphone",
      description: "React Native, Expo, Kotlin, Swift and Flutter.",
    },
    {
      title: "Real-time systems",
      icon: "radio",
      description: "WebSockets, Redis and event-driven back ends.",
    },
    {
      title: "AI-powered solutions",
      icon: "bot",
      description: "Integrating AI development tools and automation.",
    },
  ],
};
