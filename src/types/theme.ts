/** Semantic color tokens. Each key becomes a CSS custom property `--<kebab-key>`. */
export interface ColorTokens {
  background: string;
  surface: string;
  surfaceStrong: string;
  foreground: string;
  muted: string;
  subtle: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  ring: string;
  success: string;
  danger: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  glow: string;
}

/** Tokens for the room's interface: overlays, screens, dialogs and the loader. */
export interface ThemeConfig {
  colors: ColorTokens;
  shadows: ShadowTokens;
  radii: { sm: string; md: string; lg: string; xl: string };
  typography: {
    /** Letter-spacing applied to large headings. */
    displayTracking: string;
    displayWeight: number;
    bodyLineHeight: number;
  };
}
