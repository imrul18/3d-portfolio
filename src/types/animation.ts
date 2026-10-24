/**
 * - `user`: follow the visitor's `prefers-reduced-motion` setting.
 * - `always`: always use reduced motion.
 * - `never`: ignore the OS setting (not recommended).
 */
export type ReducedMotionBehavior = "user" | "always" | "never";

export interface AnimationConfig {
  /**
   * With reduced motion the camera jumps between stations instead of flying,
   * and idle movement (pointer parallax, fans) stops.
   */
  reducedMotion: ReducedMotionBehavior;
}
