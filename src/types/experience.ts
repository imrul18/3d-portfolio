export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship"
  | "self-employed";

/** Either an on-site/hybrid location (place optional) or a remote role. */
export type WorkLocation =
  | { kind: "onsite" | "hybrid"; place?: string }
  | { kind: "remote"; region?: string };

/** A current role has no end date; a past role must have one. */
export type RolePeriod =
  | { currentlyWorking: true; endDate?: undefined }
  | { currentlyWorking: false; endDate?: string };

/** One position held at a company. */
export type ExperienceRole = RolePeriod & {
  id: string;
  title: string;
  /** `YYYY-MM` */
  startDate: string;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  /** Set to false to keep the role without publishing it. Defaults to true. */
  enabled?: boolean;
};

/** A company and every role held there. Each company is one card. */
export interface ExperienceCompany {
  id: string;
  company: string;
  companyUrl?: string;
  employmentType?: EmploymentType;
  location?: WorkLocation;
  /** Roles in display order (newest first reads best). */
  roles: ExperienceRole[];
  enabled: boolean;
}

export interface ExperienceSectionConfig {
  /** Shown instead of an end date for current roles. */
  presentLabel: string;
  /** Companies in display order; each becomes one card. */
  companies: ExperienceCompany[];
}

/** Display-ready card data derived from an `ExperienceCompany`. */
export interface ExperienceCard {
  id: string;
  company: string;
  companyUrl?: string;
  employmentType?: EmploymentType;
  location?: WorkLocation;
  /** True when any published role here is current. */
  currentlyWorking: boolean;
  /** Earliest start across the roles. */
  startDate: string;
  /** Latest end; undefined while currently working here. */
  endDate?: string;
  roles: ExperienceRole[];
  /** Every technology used across the roles, without duplicates. */
  technologies: string[];
}
