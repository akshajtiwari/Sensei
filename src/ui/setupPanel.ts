import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getSystemInfo } from "../utils/systemCheck";
import { MODEL_TIERS, pullModel } from "../ollama/modelManager";
import { logger } from "../utils/logger";

// First-run setup page. It recommends a model, shows download progress, and
// saves the selected model in VS Code settings.
export async function setupPanel(
  context: vscode.ExtensionContext,
): Promise<void> {
  const sysInfo = await getSystemInfo();
  const panel = vscode.window.createWebviewPanel(
    "senseiSetup",
    "Sensei Setup",
    vscode.ViewColumn.One,
    { enableScripts: true },
  );

  const htmlPath = path.join(context.extensionPath, "media", "setup.html");
  const cssPath = vscode.Uri.file(
    path.join(context.extensionPath, "media", "setup.css"),
  );
  const cssUri = panel.webview.asWebviewUri(cssPath).toString();

  let html = fs.readFileSync(htmlPath, "utf8");
  html = html.split("__CSP_SOURCE__").join(panel.webview.cspSource);
  html = html.split("__CSS__").join(cssUri);
  html = html.split("__RAM__").join(String(sysInfo.totalRAMgb));
  html = html.split("__RECOMMENDED__").join(sysInfo.recommendedTier);
  html = html.split("__MINIMUM__").join(MODEL_TIERS.minimum);
  html = html.split("__AVERAGE__").join(MODEL_TIERS.average);
  html = html.split("__GOOD__").join(MODEL_TIERS.good);
  panel.webview.html = html;

  const validModels = Object.values(MODEL_TIERS) as string[];
  panel.webview.onDidReceiveMessage(
    async (message: { command?: string; model?: string }) => {
      if (message.command !== "download" || !message.model) {
        return;
      }
      if (!validModels.includes(message.model)) {
        return;
      }

      const selectedModel = message.model;
      const ok = await pullModel(selectedModel, (status) => {
        logger.info(status);
        const match = status.match(/^(\d+)%$/);
        const percent = match ? Number(match[1]) : 100;
        void panel.webview.postMessage({
          command: "progress",
          percent,
          status,
        });
      });

      if (!ok) {
        void panel.webview.postMessage({
          command: "error",
          status: "Download failed. Check that Ollama is running.",
        });
        return;
      }

      await vscode.workspace
        .getConfiguration("sensei")
        .update("model", selectedModel, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `Sensei ready. Model: ${selectedModel}. Reload VS Code to start.`,
      );
      panel.dispose();
    },
    undefined,
    context.subscriptions,
  );
}
