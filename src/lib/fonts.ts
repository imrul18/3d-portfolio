import { Geist, Geist_Mono, Yellowtail } from "next/font/google";

/**
 * Typefaces. Swap these for any `next/font/google` family; the CSS
 * variables keep the rest of the design system unchanged.
 */
export const sansFont = Geist({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  display: "swap",
});

/** Script face used for neon signs in the 3D room. */
export const neonFont = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-neon-family",
  display: "swap",
});

export const fontVariables = `${sansFont.variable} ${monoFont.variable} ${neonFont.variable}`;
