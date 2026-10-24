"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { roomConfig } from "@/config/room";

const { palette } = roomConfig;
const WALL_RADIUS = 12;
// The wall wraps around the back of the room, leaving the front open to the camera.
const WALL_START = Math.PI * 0.32;
const WALL_LENGTH = Math.PI * 1.36;

/** Hexagon outlines drawn once onto a canvas, tiled across the floor. */
function createHexTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = palette.floor;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = palette.floorLines;
    ctx.lineWidth = 2;
    const r = size / 4;
    const h = Math.sqrt(3) * r;
    for (let row = -1; row < 4; row++) {
      for (let col = -1; col < 4; col++) {
        const cx = col * r * 3 + (row % 2 ? r * 1.5 : 0);
        const cy = row * (h / 2);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const a = (Math.PI / 3) * i;
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Floor, curved back wall and the warm LED strip along its base. */
export function RoomShell() {
  const hex = useMemo(() => createHexTexture(), []);
  useEffect(() => () => hex.dispose(), [hex]);

  return (
    <group>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 16, 34]} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[WALL_RADIUS + 0.5, 96]} />
        <meshStandardMaterial map={hex} roughness={0.85} metalness={0.1} />
      </mesh>

      <mesh position-y={3.5}>
        <cylinderGeometry args={[WALL_RADIUS, WALL_RADIUS, 7, 96, 1, true, WALL_START, WALL_LENGTH]} />
        <meshStandardMaterial color={palette.wall} emissive={palette.wall} emissiveIntensity={0.6} side={THREE.BackSide} roughness={0.95} />
      </mesh>

      {/* Warm LED strip along the base of the wall */}
      <mesh position-y={0.05} rotation={[Math.PI / 2, 0, -Math.PI / 2 - WALL_START]}>
        <torusGeometry args={[WALL_RADIUS - 0.08, 0.025, 6, 160, WALL_LENGTH]} />
        <meshBasicMaterial color={palette.led} toneMapped={false} />
      </mesh>
    </group>
  );
}
