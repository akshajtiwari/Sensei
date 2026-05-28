import * as os from "os";
import checkDiskSpace from "check-disk-space";
import { ModelTier } from "../ollama/modelManager";

export interface SystemInfo {
  totalRAMgb: number;
  freeStorageGb: number;
  recommendedTier: ModelTier;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const totalRAMgb = Math.round(os.totalmem() / 1024 ** 3);

  // Check disk space on root or C drive
  const drivePath = process.platform === "win32" ? "C:/" : "/";
  const disk = await checkDiskSpace(drivePath);
  const freeStorageGb = Math.round(disk.free / 1024 ** 3);

  let recommendedTier: ModelTier = "minimum";
  if (totalRAMgb >= 8) {
    recommendedTier = "good";
  } else if (totalRAMgb >= 4) {
    recommendedTier = "average";
  }

  return { totalRAMgb, freeStorageGb, recommendedTier };
}
