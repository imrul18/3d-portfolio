"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { roomConfig } from "@/config/room";

const { palette } = roomConfig;

/** Desk height (top surface) used by everything that sits on it. */
export const DESK_TOP = 0.78;

function Glow({ color, args, position }: { color: string; args: [number, number, number]; position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export function Desk() {
  return (
    <group>
      <mesh position={[0, DESK_TOP - 0.04, 0]}>
        <boxGeometry args={[3.8, 0.08, 1.3]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.45} metalness={0.3} />
      </mesh>
      {/* Red edge light along the front and sides */}
      <Glow color={palette.accent} args={[3.8, 0.012, 0.012]} position={[0, DESK_TOP - 0.075, 0.655]} />
      <Glow color={palette.accent} args={[0.012, 0.012, 1.3]} position={[-1.905, DESK_TOP - 0.075, 0]} />
      <Glow color={palette.accent} args={[0.012, 0.012, 1.3]} position={[1.905, DESK_TOP - 0.075, 0]} />
      {/* Drawer pedestals */}
      {[-1.4, 1.4].map((x) => (
        <group key={x} position={[x, (DESK_TOP - 0.08) / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.9, DESK_TOP - 0.08, 1.2]} />
            <meshStandardMaterial color={palette.furniture} roughness={0.6} />
          </mesh>
          <Glow color={palette.accent} args={[0.9, 0.01, 0.01]} position={[0, (DESK_TOP - 0.08) / 2 - 0.02, 0.605]} />
        </group>
      ))}
    </group>
  );
}

interface MonitorProps {
  children?: ReactNode;
}

/** Ultra-wide curved monitor. Children render on the screen surface. */
export function Monitor({ children }: MonitorProps) {
  const radius = 2.6;
  const arc = 0.92;
  const height = 0.98;
  const centerY = DESK_TOP + 0.62;
  const z = -0.4;
  return (
    <group>
      {/* Frame */}
      {/* The circle's center is in front of the screen, so it curves toward the viewer. */}
      <mesh position={[0, centerY, z + radius]}>
        <cylinderGeometry args={[radius + 0.03, radius + 0.03, height + 0.06, 64, 1, true, Math.PI - arc / 2 - 0.012, arc + 0.024]} />
        <meshStandardMaterial color={palette.furnitureLight} roughness={0.35} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Panel */}
      <mesh position={[0, centerY, z + radius]}>
        <cylinderGeometry args={[radius, radius, height, 64, 1, true, Math.PI - arc / 2, arc]} />
        <meshBasicMaterial color={palette.screen} side={THREE.DoubleSide} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, DESK_TOP + 0.2, z - 0.12]}>
        <boxGeometry args={[0.07, 0.42, 0.05]} />
        <meshStandardMaterial color={palette.furnitureLight} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, DESK_TOP + 0.01, z - 0.05]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color={palette.furnitureLight} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Soft spill light from the screen */}
      <pointLight position={[0, centerY, z + 0.6]} intensity={1.6} distance={3} color="#9fd8ff" />
      <group position={[0, centerY, z + 0.09]}>{children}</group>
    </group>
  );
}

/** Mechanical keyboard with instanced keys. */
export function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const layout = useMemo(() => {
    const items: { x: number; z: number; dark: boolean }[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 16; col++) {
        items.push({ x: -0.47 + col * 0.0625, z: -0.11 + row * 0.055, dark: (row + col) % 7 === 0 || col > 13 });
      }
    }
    return items;
  }, []);

  const setRef = (mesh: THREE.InstancedMesh | null) => {
    keys.current = mesh;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    layout.forEach((key, i) => {
      matrix.setPosition(key.x, 0, key.z);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, color.set(key.dark ? "#2a2a30" : palette.furnitureLight));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  return (
    <group position={[0, DESK_TOP + 0.02, 0.22]}>
      <mesh>
        <boxGeometry args={[1.05, 0.035, 0.32]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.6} />
      </mesh>
      <instancedMesh ref={setRef} args={[undefined, undefined, layout.length]} position-y={0.03}>
        <boxGeometry args={[0.052, 0.03, 0.046]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>
      {/* Mouse */}
      <mesh position={[0.72, 0.005, 0.02]} scale={[1, 0.5, 1.5]}>
        <sphereGeometry args={[0.045, 24, 16]} />
        <meshStandardMaterial color={palette.furnitureLight} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** White PC tower with a glass side and spinning RGB fans. */
export function PcTower() {
  const fans = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    fans.current?.children.forEach((fan) => (fan.rotation.z += delta * 2));
  });
  return (
    <group position={[-1.5, DESK_TOP + 0.5, -0.2]}>
      <RoundedBox args={[0.5, 1, 0.95]} radius={0.02}>
        <meshStandardMaterial color={palette.furnitureLight} roughness={0.3} metalness={0.2} />
      </RoundedBox>
      {/* Glass panel facing the desk */}
      <mesh position={[0.252, 0, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[0.88, 0.92]} />
        <meshStandardMaterial color="#0b0f14" roughness={0.1} metalness={0.6} transparent opacity={0.85} />
      </mesh>
      <group ref={fans}>
        {[0.28, 0, -0.28].map((y) => (
          <mesh key={y} position={[0.255, y, 0.2]} rotation-y={Math.PI / 2}>
            <torusGeometry args={[0.1, 0.012, 8, 40]} />
            <meshBasicMaterial color={palette.fan} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0.5, 0, 0.2]} intensity={1.2} distance={2} color={palette.fan} />
    </group>
  );
}

/** Gaming chair facing the desk. */
export function Chair() {
  const black = <meshStandardMaterial color="#121216" roughness={0.7} />;
  const red = <meshStandardMaterial color={palette.accent} roughness={0.5} emissive={palette.accent} emissiveIntensity={0.15} />;
  return (
    <group position={[1.15, 0, 1.45]} rotation-y={Math.PI + 0.7}>
      <RoundedBox args={[0.6, 0.12, 0.58]} radius={0.04} position={[0, 0.52, 0]}>
        {black}
      </RoundedBox>
      <RoundedBox args={[0.58, 0.95, 0.12]} radius={0.05} position={[0, 1.05, 0.3]} rotation-x={-0.12}>
        {black}
      </RoundedBox>
      {/* Red side bolsters */}
      {[-0.26, 0.26].map((x) => (
        <RoundedBox key={x} args={[0.07, 0.85, 0.14]} radius={0.03} position={[x, 1.05, 0.31]} rotation-x={-0.12}>
          {red}
        </RoundedBox>
      ))}
      <RoundedBox args={[0.3, 0.14, 0.1]} radius={0.04} position={[0, 1.42, 0.36]} rotation-x={-0.12}>
        {red}
      </RoundedBox>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
        <meshStandardMaterial color="#2a2a30" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.17, 0.08, Math.sin((i / 5) * Math.PI * 2) * 0.17]} rotation-y={-(i / 5) * Math.PI * 2}>
          <boxGeometry args={[0.34, 0.03, 0.04]} />
          <meshStandardMaterial color="#1c1c22" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

interface PhoneProps {
  children?: ReactNode;
}

/** Phone standing on a small dock to the right of the keyboard. */
export function Phone({ children }: PhoneProps) {
  return (
    <group position={[1.42, DESK_TOP + 0.26, 0.05]} rotation-x={-0.18}>
      <RoundedBox args={[0.2, 0.42, 0.018]} radius={0.02}>
        <meshStandardMaterial color="#111114" roughness={0.3} metalness={0.6} />
      </RoundedBox>
      <mesh position-z={0.0095}>
        <planeGeometry args={[0.185, 0.4]} />
        <meshBasicMaterial color={palette.screen} />
      </mesh>
      <mesh position={[0, -0.24, -0.05]} rotation-x={0.4}>
        <boxGeometry args={[0.16, 0.06, 0.12]} />
        <meshStandardMaterial color={palette.furniture} roughness={0.5} />
      </mesh>
      <group position-z={0.011}>{children}</group>
    </group>
  );
}
