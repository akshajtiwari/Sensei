import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getSystemInfo } from "../utils/systemCheck";
import { MODEL_TIERS, pullModel } from "../ollama/modelManager";
import { logger } from "../utils/logger";

// Stub — full webview panel to be built in Phase 3
export async function setupPanel(
  context: vscode.ExtensionContext,
): Promise<void> {
  const sysInfo = await getSystemInfo();

  const tierLabel =
    sysInfo.recommendedTier.charAt(0).toUpperCase() +
    sysInfo.recommendedTier.slice(1);
  const modelName =
    MODEL_TIERS[sysInfo.recommendedTier as keyof typeof MODEL_TIERS];
  const choice = await vscode.window.showInformationMessage(
    `Sensei detected ${sysInfo.totalRAMgb}GB RAM. Recommended model: ${tierLabel} (${modelName})`,
    "Download Recommended",
    "Choose Manually",
  );

  let selectedModel = modelName;

  if (choice === "Choose Manually") {
    const picked = await vscode.window.showQuickPick(
      [
        {
          label: "Minimum",
          description: MODEL_TIERS.minimum,
          detail: "For ≤4GB RAM",
        },
        {
          label: "Average",
          description: MODEL_TIERS.average,
          detail: "For 4-8GB RAM",
        },
        {
          label: "Good",
          description: MODEL_TIERS.good,
          detail: "For 8GB+ RAM",
        },
      ],
      { placeHolder: "Pick a model tier" },
    );
    if (!picked) {
      return;
    }
    selectedModel = picked.description!;
  }

  if (!choice) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Downloading ${selectedModel}...`,
      cancellable: true,
    },
    async () => {
      const ok = await pullModel(selectedModel, (status) =>
        logger.info(status),
      );
      if (ok) {
        await vscode.workspace
          .getConfiguration("sensei")
          .update("model", selectedModel, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
          `Sensei ready. Model: ${selectedModel}`,
        );
      } else {
        vscode.window.showErrorMessage(
          "Model download failed. Check Ollama is running.",
        );
      }
    },
  );
}
