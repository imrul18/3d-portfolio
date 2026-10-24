import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Whether a `/public` path (e.g. "/images/profile.jpg") exists on disk. */
export function publicFileExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  return existsSync(join(process.cwd(), "public", src));
}
