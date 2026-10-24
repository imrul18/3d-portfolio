import type { RoomConfig } from "@/types/room";

/**
 * The scroll-driven 3D room — the whole site. Each enabled section gets a
 * camera stop in the order set by `siteConfig.sections`.
 *
 * Coordinates are in meters. The desk sits at the origin, facing +z.
 */
export const roomConfig: RoomConfig = {
  compactWidth: 1024,
  neonColor: "#ff2d55",
  palette: {
    background: "#09090c",
    floor: "#1d1d22",
    floorLines: "#34343c",
    wall: "#1e1e24",
    furniture: "#0d0d10",
    furnitureLight: "#e8e8ec",
    accent: "#ff2a3d",
    led: "#ffd3a3",
    screen: "#05080b",
    wood: "#c9a877",
    paper: "#f1ead8",
    fan: "#5ee7ff",
  },

  loader: { title: "AFNAN · PORTFOLIO", message: "Setting up the room…" },

  snap: { enabled: true, threshold: 0.1 },

  labels: {
    scroll: "Scroll to explore",
    read: "Read",
    discuss: "Discuss this",
    noWebgl: "This portfolio is an interactive 3D room and needs WebGL, which this browser doesn't support or has turned off.",
    noScript: "This portfolio is an interactive 3D room. Turn on JavaScript to explore it.",
  },

  stations: {
    hero: { camera: [5.4, 3.3, 6.4], target: [0.4, 0.9, -0.6] },
    about: {
      camera: [-3.6, 1.9, -2.2],
      target: [-3.6, 1.9, -5.36],
      neon: "About me",
      hint: "Who I am and what I work on",
    },
    experience: {
      camera: [0, 1.45, 1.55],
      target: [0, 1.38, -0.4],
      neon: "My Journey",
      hint: "Scroll inside the screen to read more",
    },
    skills: {
      camera: [-4.2, 1.25, 2.1],
      target: [-4.2, 1.03, 0.98],
      neon: "My Skillset",
      hint: "Languages, frameworks and platforms",
    },
    projects: {
      camera: [4.2, 1.5, -2.0],
      target: [4.2, 1.45, -4.42],
      neon: "My Work",
      hint: "Click a project to open it",
    },
    services: {
      camera: [3.6, 2.6, 4.3],
      target: [3.6, 0.42, 3.05],
      neon: "How I Help",
      hint: "Ways we can work together",
    },
    contact: {
      camera: [1.42, 1.22, 1.02],
      target: [1.42, 1.04, 0.05],
      neon: "Say Hello",
      hint: "Pick a channel",
    },
  },
};
