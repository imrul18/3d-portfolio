import type { IconName } from "./icon";
import type { CallToAction } from "./site";

/** The room's opening view. */
export interface HeroConfig {
  /** Small line above the name, e.g. "Hi, I'm". */
  greeting?: string;
  /** Name shown as the headline; defaults to `siteConfig.name`. */
  headline?: string;
  title: string;
  /** Roles cycled on the line under the title, each sliding in from the top. */
  roles: string[];
  /** Milliseconds each role stays before the next slides in. */
  roleInterval: number;
  intro: string;
  /** Shown as chips under the intro. */
  specialties: string[];
  primaryCta: CallToAction;
  /** Also requires `siteConfig.resume.enabled`. */
  showResumeButton: boolean;
  showSocialLinks: boolean;
  availability: { enabled: boolean; label: string };
  /** Your photo, shown on the About easel when the file exists. */
  portrait: {
    /** Path under /public, e.g. "/images/profile.jpg". */
    src: string;
    alt: string;
    /** CSS object-position, to keep your face in frame when cropped. */
    focus?: string;
  };
}

export interface AboutConfig {
  heading: string;
  biography: string[];
  specializations: { title: string; icon: IconName; description?: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  details?: string[];
  enabled: boolean;
}

export interface ContactConfig {
  heading: string;
  intro: string;
  /** Leave empty to keep your address off the site. */
  email: string;
  /** Explicit opt-in for publishing `email`. */
  publishEmail: boolean;
  form: {
    /**
     * Offer the contact form (a popup from the phone). It only appears when the
     * server also has MAIL_API_URL and CONTACT_TO_EMAIL set (Aetherix mail API); see README.
     */
    enabled: boolean;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface SeoConfig {
  title: string;
  /** `%s` is replaced by the page title. */
  titleTemplate: string;
  description: string;
  keywords: string[];
  twitterHandle?: string;
  /** Allow search engines to index the site. */
  index: boolean;
  /** Emit schema.org Person structured data. */
  jsonLd: boolean;
}
