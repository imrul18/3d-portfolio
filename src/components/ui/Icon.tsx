import type { ComponentType, SVGProps } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Briefcase,
  Calendar,
  Cloud,
  Code,
  Cpu,
  Database,
  Download,
  FileText,
  Gauge,
  Globe,
  Layers,
  LayoutTemplate,
  Lightbulb,
  Link,
  Mail,
  MapPin,
  Phone,
  Plug,
  Radio,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Users,
  Workflow,
} from "lucide-react";
import type { IconName } from "@/types/icon";
import {
  DevtoIcon,
  DribbbleIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MediumIcon,
  StackoverflowIcon,
  XIcon,
  YoutubeIcon,
} from "./BrandIcons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

/** Maps configuration icon names to components. Must cover every `IconName`. */
const registry: Record<IconName, IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  dribbble: DribbbleIcon,
  medium: MediumIcon,
  devto: DevtoIcon,
  stackoverflow: StackoverflowIcon,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  globe: Globe,
  link: Link,
  "file-text": FileText,
  download: Download,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  calendar: Calendar,
  briefcase: Briefcase,
  sparkles: Sparkles,
  server: Server,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  database: Database,
  cloud: Cloud,
  bot: Bot,
  code: Code,
  plug: Plug,
  radio: Radio,
  gauge: Gauge,
  lightbulb: Lightbulb,
  layers: Layers,
  cpu: Cpu,
  shield: Shield,
  rocket: Rocket,
  users: Users,
  workflow: Workflow,
  terminal: Terminal,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...props }: IconProps) {
  const Component = registry[name];
  return <Component size={size} aria-hidden="true" focusable="false" {...props} />;
}
