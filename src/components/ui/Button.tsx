import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn, externalLinkProps } from "@/lib/utils";
import type { IconName } from "@/types/icon";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-glow hover:brightness-110",
  secondary: "border border-primary/60 text-primary hover:bg-primary/10 hover:border-primary",
  ghost: "text-muted hover:text-foreground hover:bg-surface-strong/70",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Places the icon after the label and nudges it on hover. */
  trailingIcon?: boolean;
  children: ReactNode;
}

function Content({ icon, trailingIcon, children }: Pick<CommonProps, "icon" | "trailingIcon" | "children">) {
  const iconNode = icon ? (
    <Icon
      name={icon}
      size={16}
      className={cn(
        "transition-transform duration-300",
        trailingIcon && "group-hover:translate-x-0.5 group-hover:-translate-y-px",
      )}
    />
  ) : null;
  return (
    <>
      {!trailingIcon && iconNode}
      <span>{children}</span>
      {trailingIcon && iconNode}
    </>
  );
}

type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** An anchor styled as a button. External URLs open in a new tab safely. */
export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  className,
  children,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <a
      href={href}
      {...externalLinkProps(href)}
      {...props}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      <Content icon={icon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </a>
  );
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props} className={cn(base, variants[variant], sizes[size], className)}>
      <Content icon={icon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </button>
  );
}
