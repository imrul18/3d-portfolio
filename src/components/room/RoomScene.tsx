"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { roomConfig } from "@/config/room";
import type { ServiceItem } from "@/types/content";
import type { ProjectCardData } from "@/types/project-card";
import type { RoomData, Vec3 } from "@/types/room";
import type { SectionId } from "@/types/site";
import { Chair, Desk, Keyboard, Monitor, PcTower, Phone } from "./DeskSetup";
import { RoomShell } from "./RoomShell";
import { Screen } from "./Screen";
import {
  AboutBoard,
  ContactPhoneScreen,
  ExperienceScreen,
  ProjectsScreen,
  ServicePaperContent,
  SkillsScreen,
} from "./ScreenContent";
import { CoffeeTable, Decor, Easel, LaptopStation, Paper, TvStation } from "./Stations";

interface RoomSceneProps {
  data: RoomData;
  /** Continuous station position, 0 … stations.length - 1. */
  progress: RefObject<number>;
  /** Rounded station index, used to activate screens. */
  activeIndex: number;
  /** Normalized pointer position for subtle camera parallax. */
  pointer: RefObject<{ x: number; y: number }>;
  animate: boolean;
  /** Phone layout: screens are visual only; content opens in a panel. */
  compact: boolean;
  onOpenProject: (project: ProjectCardData) => void;
  onOpenService: (service: ServiceItem) => void;
}

/** Ease that lingers at each station and moves quickly between them. */
function dwell(t: number) {
  const x = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

const LANDSCAPE_ASPECT = 16 / 10;
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const overview = new THREE.Vector3(...(roomConfig.stations.hero?.camera ?? [6.8, 4.4, 8.6]));

/** Moves the camera along the station path as the page scrolls. */
function CameraRig({ stations, progress, pointer, animate }: { stations: RoomData["stations"]; progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }>; animate: boolean }) {
  const { camera, size } = useThree();
  const lookAt = useRef(new THREE.Vector3(...(stations[0]?.target ?? [0, 1, 0])));
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (stations.length === 0) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), stations.length - 1);
    const i = Math.min(Math.floor(p), stations.length - 2);
    const from = stations[Math.max(i, 0)];
    const to = stations[Math.min(i + 1, stations.length - 1)];
    const e = stations.length > 1 ? dwell(p - Math.max(i, 0)) : 0;

    desiredPos.current.lerpVectors(tmpA.set(...from.camera), tmpB.set(...to.camera), e);
    // Arc up and back toward the overview mid-flight so the camera doesn't clip furniture.
    const lift = Math.sin(Math.PI * e);
    desiredPos.current.lerp(overview, lift * 0.28);
    desiredPos.current.y += lift * 0.5;
    desiredTarget.current.lerpVectors(tmpA.set(...from.target), tmpB.set(...to.target), e);

    // Stations are framed for landscape screens. On narrower (portrait) screens,
    // pull the camera back along its view line so the subject still fits.
    const aspect = size.width / Math.max(size.height, 1);
    const fit = Math.min(2.2, Math.max(1, Math.pow(LANDSCAPE_ASPECT / aspect, 0.8)));
    if (fit > 1) {
      tmpA.subVectors(desiredPos.current, desiredTarget.current).multiplyScalar(fit);
      desiredPos.current.copy(desiredTarget.current).add(tmpA);
    }

    if (animate) {
      const pt = pointer.current ?? { x: 0, y: 0 };
      desiredPos.current.x += pt.x * 0.06;
      desiredPos.current.y -= pt.y * 0.04;
    }

    const k = animate ? 1 - Math.pow(0.0008, delta) : 1;
    camera.position.lerp(desiredPos.current, k);
    lookAt.current.lerp(desiredTarget.current, k);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/** Paper layout on the coffee table: position offsets and rotation. */
const PAPER_SPOTS: { position: Vec3; rotation: number }[] = [
  { position: [-0.7, 0, -0.18], rotation: 0.12 },
  { position: [-0.22, 0.001, 0.12], rotation: -0.08 },
  { position: [0.25, 0.002, -0.2], rotation: 0.06 },
  { position: [0.72, 0.003, 0.1], rotation: -0.14 },
  { position: [-0.45, 0.004, 0.32], rotation: 0.2 },
  { position: [0.48, 0.005, 0.34], rotation: 0.1 },
  { position: [0.02, 0.006, 0.36], rotation: -0.18 },
];

export default function RoomScene({ data, progress, activeIndex, pointer, animate, compact, onOpenProject, onOpenService }: RoomSceneProps) {
  // drei's <Html> needs the canvas container in the DOM; mounting screens before
  // the first frame makes the first one unmount mid-render and disappear.
  const [screensReady, setScreensReady] = useState(false);
  useFrame(() => {
    if (!screensReady) setScreensReady(true);
  });

  const indexOf = (id: SectionId) => data.stations.findIndex((station) => station.id === id);
  const state = (id: SectionId) => {
    const index = indexOf(id);
    const active = index >= 0 && index === activeIndex;
    // HTML isn't depth-tested, so only the current screen shows (plus all of
    // them as decoration in the overview, where nothing blocks them).
    const visible = index >= 0 && (active || activeIndex === 0);
    return { active, visible, interactive: !compact };
  };
  const label = (id: SectionId) => data.stations.find((station) => station.id === id)?.label ?? id;

  return (
    <>
      <RoomShell />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#ffe9d6", "#1a1020", 0.8]} />
      <spotLight position={[0, 6, 3]} angle={0.8} penumbra={0.7} intensity={60} distance={16} color="#fff1e0" />
      <pointLight position={[0, 4, -6]} intensity={14} distance={16} color="#ffd3a3" />
      <pointLight position={[-6, 3, 4]} intensity={10} distance={14} color={roomConfig.palette.accent} />
      <pointLight position={[6, 3, -2]} intensity={8} distance={14} color="#6cb6ff" />

      <Desk />
      <Monitor>
        {screensReady && data.experience && (
          <Screen width={2.3} height={0.92} pixelWidth={1150} {...state("experience")} label={label("experience")}>
            <ExperienceScreen {...data.experience} logo={data.logo} />
          </Screen>
        )}
      </Monitor>
      <Keyboard />
      <PcTower />
      <Chair />
      <Phone>
        {screensReady && data.contact && (
          <Screen width={0.18} height={0.39} pixelWidth={270} {...state("contact")} label={label("contact")}>
            <ContactPhoneScreen {...data.contact} />
          </Screen>
        )}
      </Phone>

      <LaptopStation>
        {screensReady && data.skills && (
          <Screen width={0.86} height={0.54} pixelWidth={780} {...state("skills")} label={label("skills")}>
            <SkillsScreen {...data.skills} />
          </Screen>
        )}
      </LaptopStation>

      <TvStation>
        {screensReady && data.projects && (
          <Screen width={2.6} height={1.44} pixelWidth={1200} {...state("projects")} label={label("projects")}>
            <ProjectsScreen {...data.projects} onOpen={onOpenProject} />
          </Screen>
        )}
      </TvStation>

      <CoffeeTable>
        {screensReady && data.services?.items.slice(0, PAPER_SPOTS.length).map((service, index) => (
          <Paper key={service.id} {...PAPER_SPOTS[index]}>
            <Screen width={0.42} height={0.56} pixelWidth={330} {...state("services")} label={service.title}>
              <ServicePaperContent service={service} onOpen={onOpenService} />
            </Screen>
          </Paper>
        ))}
      </CoffeeTable>

      <Easel>
        {screensReady && data.about && (
          <Screen width={1.46} height={1.96} pixelWidth={580} {...state("about")} label={label("about")}>
            <AboutBoard {...data.about} />
          </Screen>
        )}
      </Easel>

      <Decor />
      <ContactShadows position={[0, 0.005, 0]} scale={14} blur={2.4} opacity={0.6} far={2} frames={1} />
      <CameraRig stations={data.stations} progress={progress} pointer={pointer} animate={animate} />
    </>
  );
}
