"use client";

import type { ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import { roomConfig } from "@/config/room";
import type { Vec3 } from "@/types/room";

const { palette } = roomConfig;

/** Positions shared with the camera stations in `src/config/room.ts`. */
export const LAPTOP_POSITION: Vec3 = [-4.2, 0, 1.3];
export const TV_POSITION: Vec3 = [4.2, 0, -4.4];
export const TABLE_POSITION: Vec3 = [3.6, 0, 3.05];
export const EASEL_POSITION: Vec3 = [-3.6, 0, -5.4];

/** Laptop on a side table. Children render on its screen. */
export function LaptopStation({ children }: { children?: ReactNode }) {
  const top = 0.72;
  return (
    <group position={LAPTOP_POSITION}>
      <mesh position-y={top - 0.03}>
        <boxGeometry args={[1.5, 0.06, 0.9]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position-y={(top - 0.06) / 2}>
        <cylinderGeometry args={[0.06, 0.2, top - 0.06, 24]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Base with a green-lit keyboard */}
      <RoundedBox args={[0.92, 0.03, 0.62]} radius={0.01} position={[0, top + 0.015, 0.05]}>
        <meshStandardMaterial color="#16181c" roughness={0.4} metalness={0.5} />
      </RoundedBox>
      <mesh position={[0, top + 0.031, 0.02]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.78, 0.3]} />
        <meshBasicMaterial color="#1f6b45" toneMapped={false} transparent opacity={0.45} />
      </mesh>
      {/* Screen, hinged at the back edge and tilted slightly back */}
      <group position={[0, top + 0.03, -0.26]} rotation-x={-0.22}>
        <RoundedBox args={[0.92, 0.6, 0.02]} radius={0.01} position-y={0.3}>
          <meshStandardMaterial color="#16181c" roughness={0.4} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.3, 0.011]}>
          <planeGeometry args={[0.88, 0.56]} />
          <meshBasicMaterial color={palette.screen} />
        </mesh>
        <group position={[0, 0.3, 0.012]}>{children}</group>
      </group>
      <pointLight position={[0, 1.1, 0.4]} intensity={0.8} distance={2} color="#22ff88" />
    </group>
  );
}

/** Wall-mounted style TV on a media console. Children render on the screen. */
export function TvStation({ children }: { children?: ReactNode }) {
  return (
    <group position={TV_POSITION}>
      <mesh position-y={0.25}>
        <boxGeometry args={[3, 0.5, 0.6]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.02, 0.62]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.06, 0.31]}>
        <boxGeometry args={[3, 0.01, 0.01]} />
        <meshBasicMaterial color={palette.led} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.58, -0.05]}>
        <boxGeometry args={[0.5, 0.12, 0.25]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.4} />
      </mesh>
      <RoundedBox args={[2.72, 1.56, 0.06]} radius={0.015} position={[0, 1.45, -0.05]}>
        <meshStandardMaterial color="#0e0e11" roughness={0.3} metalness={0.5} />
      </RoundedBox>
      <mesh position={[0, 1.45, -0.018]}>
        <planeGeometry args={[2.64, 1.48]} />
        <meshBasicMaterial color={palette.screen} />
      </mesh>
      <pointLight position={[0, 1.45, 0.8]} intensity={1.4} distance={3.5} color="#9fd8ff" />
      <group position={[0, 1.45, -0.016]}>{children}</group>
    </group>
  );
}

/** Low wooden table. Children are laid flat on the tabletop. */
export function CoffeeTable({ children }: { children?: ReactNode }) {
  const top = 0.42;
  return (
    <group position={TABLE_POSITION}>
      <RoundedBox args={[2, 0.06, 1.15]} radius={0.02} position-y={top - 0.03}>
        <meshStandardMaterial color={palette.wood} roughness={0.65} />
      </RoundedBox>
      {[
        [-0.9, -0.48],
        [0.9, -0.48],
        [-0.9, 0.48],
        [0.9, 0.48],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, (top - 0.06) / 2, z]}>
          <boxGeometry args={[0.06, top - 0.06, 0.06]} />
          <meshStandardMaterial color={palette.furniture} roughness={0.5} />
        </mesh>
      ))}
      <group position-y={top + 0.002}>{children}</group>
    </group>
  );
}

/** A sheet of paper lying on the table. */
export function Paper({ position, rotation, children }: { position: Vec3; rotation: number; children?: ReactNode }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, rotation]}>
      <mesh>
        <planeGeometry args={[0.44, 0.58]} />
        <meshStandardMaterial color={palette.paper} roughness={0.9} />
      </mesh>
      <group position-z={0.001}>{children}</group>
    </group>
  );
}

/** Framed board on an easel. Children render on the board. */
export function Easel({ children }: { children?: ReactNode }) {
  const centerY = 1.9;
  return (
    <group position={EASEL_POSITION}>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 1.1, -0.15]} rotation-x={0.08}>
          <boxGeometry args={[0.05, 2.2, 0.05]} />
          <meshStandardMaterial color={palette.furniture} roughness={0.5} />
        </mesh>
      ))}
      <RoundedBox args={[1.62, 2.12, 0.07]} radius={0.015} position-y={centerY}>
        <meshStandardMaterial color="#26262b" roughness={0.4} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, centerY, 0.036]}>
        <planeGeometry args={[1.5, 2]} />
        <meshStandardMaterial color={palette.paper} roughness={0.9} />
      </mesh>
      <spotLight position={[0, 3.6, 1.6]} angle={0.5} penumbra={0.6} intensity={18} distance={5} color={palette.led} />
      <group position={[0, centerY, 0.038]}>{children}</group>
    </group>
  );
}

/** Beanbags and a barbell to make the space feel lived in. */
export function Decor() {
  return (
    <group>
      {[
        [6.4, 3.4],
        [5.4, 4.6],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.32, z]} scale={[1, 0.62, 1]} rotation-y={i}>
          <sphereGeometry args={[0.55, 32, 24]} />
          <meshStandardMaterial color={palette.accent} roughness={0.75} />
        </mesh>
      ))}
      <group position={[0.8, 0.16, -4.2]} rotation-y={0.3}>
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 1.8, 12]} />
          <meshStandardMaterial color="#9a9aa2" metalness={0.9} roughness={0.25} />
        </mesh>
        {[-0.75, 0.75].map((x) => (
          <mesh key={x} position-x={x} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
            <meshStandardMaterial color="#1a1a1f" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
