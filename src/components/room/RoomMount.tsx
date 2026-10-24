"use client";

import dynamic from "next/dynamic";
import type { RoomData } from "@/types/room";

// Three.js and the room load on the client only; the boot loader covers the wait.
const RoomExperience = dynamic(() => import("./RoomExperience"), { ssr: false });

export function RoomMount({ data }: { data: RoomData }) {
  return <RoomExperience data={data} />;
}
