import type { ThemeConfig } from "@/types/theme";

/**
 * Design tokens for the room's interface (overlays, in-room screens, dialogs,
 * loader). They are emitted as CSS custom properties in the root layout and
 * mapped to Tailwind utilities in `src/app/globals.css`
 * (e.g. `colors.primary` → `--primary` → `bg-primary`).
 *
 * Colors of the 3D room itself (floor, walls, furniture, LEDs) live in
 * `src/config/room.ts` under `palette`.
 */
export const themeConfig: ThemeConfig = {
  colors: {
    background: "#020a05",
    surface: "#06120a",
    surfaceStrong: "#0b1c11",
    foreground: "#ecfdf1",
    muted: "#9fb5a6",
    subtle: "#62786a",
    border: "rgba(34, 255, 136, 0.12)",
    borderStrong: "rgba(34, 255, 136, 0.28)",
    primary: "#22ff88",
    primaryForeground: "#02140a",
    secondary: "#38e1c4",
    ring: "#22ff88",
    success: "#22ff88",
    danger: "#ff6b81",
  },

  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 10px 30px -12px rgba(0, 0, 0, 0.7)",
    lg: "0 40px 80px -30px rgba(0, 0, 0, 0.85)",
    glow: "0 0 0 1px rgba(34, 255, 136, 0.45), 0 0 28px -4px rgba(34, 255, 136, 0.45)",
  },

  radii: { sm: "0.5rem", md: "0.875rem", lg: "1.25rem", xl: "2rem" },

  typography: {
    displayTracking: "-0.03em",
    displayWeight: 700,
    bodyLineHeight: 1.65,
  },
};
