import type { ExperienceSectionConfig } from "@/types/experience";

/**
 * Career history, shown on the curved monitor. Each company is one card
 * listing every role held there, in the order written here.
 *
 * Mark a role `currentlyWorking: true` (no end date), or
 * `currentlyWorking: false` with an `endDate` (`YYYY-MM`).
 * Never add dates or achievements you can't back up.
 */
export const experienceConfig: ExperienceSectionConfig = {
  presentLabel: "Present",
  companies: [
    {
      id: "weezly",
      company: "Weezly",
      companyUrl: "https://weezly.de",
      employmentType: "full-time",
      location: { kind: "remote" },
      enabled: true,
      roles: [
        {
          id: "weezly-senior-developer",
          title: "Senior Developer",
          startDate: "2026-08",
          currentlyWorking: true,
          description: "Developing and maintaining scalable backend systems and web applications using PHP.",
          responsibilities: [
            "Design, develop, and maintain PHP applications.",
            "Build and optimize backend services and APIs.",
            "Improve application performance and reliability.",
            "Collaborate with the remote engineering team.",
          ],
          achievements: [],
          technologies: ["PHP"],
        },
        {
          id: "weezly-mobile-developer",
          title: "Mobile App Developer",
          startDate: "2024-04",
          endDate: "2026-07",
          currentlyWorking: false,
          description:
            "Developed native and cross-platform mobile applications for Android and iOS using Kotlin, Flutter, and Swift.",
          responsibilities: [
            "Develop Android applications using Kotlin.",
            "Build iOS applications using Swift.",
            "Create cross-platform applications with Flutter.",
            "Integrate APIs and optimize mobile app performance.",
          ],
          achievements: [],
          technologies: ["Kotlin", "Flutter", "Swift"],
        },
      ],
    },
    {
      id: "aetherix",
      company: "Aetherix Limited",
      companyUrl: "https://aetherixllc.com",
      employmentType: "full-time",
      location: { kind: "onsite" },
      enabled: true,
      roles: [
        {
          id: "aetherix-cto",
          title: "Chief Technology Officer (CTO)",
          startDate: "2025-01",
          currentlyWorking: false,
          description:
            "Leading technology strategy, software architecture, and engineering operations to build scalable and reliable digital products.",
          responsibilities: [
            "Define technical strategy and architecture.",
            "Lead development teams and oversee project delivery.",
            "Manage infrastructure, security, and system performance.",
            "Evaluate technologies and drive engineering innovation.",
          ],
          achievements: [],
          technologies: [],
        },
      ],
    },
    {
      id: "viserx",
      company: "ViserX Limited",
      companyUrl: "",
      employmentType: "full-time",
      location: { kind: "onsite" },
      enabled: true,
      roles: [
        {
          id: "viserx-senior-developer",
          title: "Senior Developer",
          startDate: "2023-03",
          endDate: "2024-03",
          currentlyWorking: false,
          description:
            "Developed and maintained full-stack web and mobile applications, focusing on scalable architecture and efficient project delivery.",
          responsibilities: [
            "Develop and maintain full-stack applications.",
            "Build backend systems using PHP, Laravel, and CodeIgniter.",
            "Develop frontend interfaces using React and Vue.",
            "Build mobile applications using React Native.",
            "Review code and collaborate with development teams.",
          ],
          achievements: [],
          technologies: ["PHP", "Laravel", "CodeIgniter", "JavaScript", "React", "Vue", "React Native"],
        },
        {
          id: "viserx-junior-developer",
          title: "Junior Developer",
          startDate: "2021-03",
          endDate: "2023-02",
          currentlyWorking: false,
          description:
            "Built and maintained web applications and mobile solutions using modern frontend and backend technologies.",
          responsibilities: [
            "Develop web applications using PHP and JavaScript.",
            "Build backend functionality with Laravel and CodeIgniter.",
            "Create responsive interfaces using React and Vue.",
            "Develop mobile features using React Native.",
            "Debug, test, and maintain existing applications.",
          ],
          achievements: [],
          technologies: ["PHP", "Laravel", "CodeIgniter", "JavaScript", "React", "Vue", "React Native"],
        },
      ],
    },
  ],
};
