import { roomConfig } from "@/config/room";

/**
 * Server-rendered intro screen for the 3D room. CSS shows it only on the home
 * page in room mode and hides it once the scene reports it is ready, so the
 * traditional layout never flashes first.
 */
export function RoomBootLoader() {
  return (
    <div
      id="room-boot"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5"
      style={{ backgroundColor: roomConfig.palette.background }}
    >
      <span className="animate-pulse-dot size-3.5 rounded-full bg-primary shadow-glow" />
      <p className="text-sm font-medium tracking-[0.45em] text-white">{roomConfig.loader.title}</p>
      <p className="text-xs text-white/50">{roomConfig.loader.message}</p>
      <div className="h-0.5 w-72 overflow-hidden rounded-full bg-white/10">
        <div className="room-boot-bar h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
      </div>
    </div>
  );
}
