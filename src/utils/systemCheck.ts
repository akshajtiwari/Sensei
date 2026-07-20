
// systemCheck.ts  —  looks at your machine (RAM/disk) to recommend a model.

import * as os from "os"; // Node's built-in module for OS info (no install)
import checkDiskSpace from "check-disk-space"; // an installed npm package
import { MODEL_TIERS, ModelTier } from "../ollama/modelManager";

// LEARN: `interface` = the shape of an object. `getSystemInfo` promises to
// return exactly these three fields with these types.
export interface SystemInfo {
  totalRAMgb: number;
  freeStorageGb: number;
  recommendedTier: ModelTier;
}

// LEARN: This is a PURE function — same input always gives the same output, and
// it touches nothing outside itself (no disk, no network). Pure functions are
// the easiest things in the world to unit-test, which is exactly why the tier
// logic was pulled out here. See src/test/systemCheck.test.ts.
//
// The three tiers should be:
//   ramGb >= 8         -> "good"
//   ramGb >= 4 (to 7)  -> "average"
//   ramGb <  4         -> "minimum"
//

export function recommendTier(ramGb: number): ModelTier {
  if (ramGb >= 8) {
    return "good";
  } else if (ramGb >= 4) {
    return "average";
  } 
  else
    return "minimum";
}

// LEARN: `async` because reading disk space returns a Promise we must `await`.
export async function getSystemInfo(): Promise<SystemInfo> {
  // `os.totalmem()` is bytes; divide by 1024^3 to get gigabytes, then round.
  const totalRAMgb = Math.round(os.totalmem() / 1024 ** 3);

  // Check free space on the system drive (C:/ on Windows, / elsewhere).
  const drivePath = process.platform === "win32" ? "C:/" : "/";
  const disk = await checkDiskSpace(drivePath);
  const freeStorageGb = Math.round(disk.free / 1024 ** 3);

  // Reuse the pure helper so the extension and the tests agree on the rules.
  const recommendedTier = recommendTier(totalRAMgb);

  // LEARN: object shorthand — `{ totalRAMgb }` means `{ totalRAMgb: totalRAMgb }`.
  return { totalRAMgb, freeStorageGb, recommendedTier };
}

// Re-export so callers can grab the model name for a tier without importing
// modelManager separately. (Used by the setup UI.)
export { MODEL_TIERS };
