import type { IconName } from "./icon";

export interface SkillCategory {
  id: string;
  label: string;
  icon: IconName;
  skills: string[];
  enabled: boolean;
}

export interface SkillsSectionConfig {
  categories: SkillCategory[];
}
