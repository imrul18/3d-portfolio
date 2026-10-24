"use client";

import type { ReactNode } from "react";
import { Html } from "@react-three/drei";
import type { Vec3 } from "@/types/room";

interface ScreenProps {
  /** Size of the display surface in scene units. */
  width: number;
  height: number;
  /** Width of the HTML content in CSS pixels; height follows the aspect ratio. */
  pixelWidth: number;
  position?: Vec3;
  rotation?: Vec3;
  /** The camera is at this screen's station: fully visible. */
  active: boolean;
  /** Accepts clicks and scrolling (off on phones, where content opens in a panel). */
  interactive: boolean;
  /** Rendered at all (inactive screens far from the camera are hidden). */
  visible: boolean;
  label: string;
  children: ReactNode;
}

/**
 * Real HTML laid onto a surface in the scene, so screen content stays crisp,
 * selectable and accessible.
 */
export function Screen({ width, height, pixelWidth, position, rotation, active, interactive, visible, label, children }: ScreenProps) {
  const pixelHeight = Math.round((pixelWidth * height) / width);
  return (
    <Html
      transform
      distanceFactor={(400 * width) / pixelWidth}
      position={position}
      rotation={rotation}
      zIndexRange={[20, 0]}
      pointerEvents={active && interactive ? "auto" : "none"}
    >
      <div
        role="region"
        aria-label={label}
        aria-hidden={!(active && interactive)}
        inert={!(active && interactive)}
        style={{
          width: pixelWidth,
          height: pixelHeight,
          opacity: visible ? (active ? 1 : 0.55) : 0,
          visibility: visible ? "visible" : "hidden",
          transition: "opacity 0.5s ease, visibility 0.5s",
        }}
        className="overflow-hidden"
      >
        {children}
      </div>
    </Html>
  );
}
