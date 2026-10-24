import { animationConfig } from "@/config/animations";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Whether camera flights and idle motion should run, combining the
 * configured reduced-motion behavior with the visitor's OS preference.
 * Returns `false` until hydration completes when the OS preference matters.
 */
export function useAllowMotion(): boolean {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  switch (animationConfig.reducedMotion) {
    case "always":
      return false;
    case "never":
      return true;
    case "user":
      return !prefersReduced;
  }
}
