import os from "os";
import * as vscode from "vscode";
import { exec, spawn } from "child_process";
import { checkOllamaHealth } from "./ollama/healthCheck";
import { setupPanel } from "./ui/setupPanel";
import { StatusBarManager } from "./ui/statusBar";
import { registerSetIntent, registerResetSession } from "./commands/setIntent";
import * as intentTracker from "./core/intentTracker";
import * as hintDelivery from "./core/hintDelivery";
import * as codeWatcher from "./core/codeWatcher";

export async function activate(context: vscode.ExtensionContext) {
  console.log("Sensei is active.");
  

  // 1. Is the Ollama server reachable?
  const ollamaRunning = await checkOllamaHealth();

  // Helper: is the `ollama` command installed at all?
  function isOllamaInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      exec("ollama --version", (err) => resolve(!err));
    });
  }
  const operating_system=os.platform();

  function startOllama(): Promise<boolean> {
    return new Promise((resolve) => {
      const process = spawn("ollama", ["serve"], {
        detached: true,
        stdio: "ignore",
      });
      process.once("error", () => resolve(false));
      process.once("spawn", () => {
        process.unref();
        resolve(true);
      });
    });
  }

  if (!ollamaRunning) {
    const installed = await isOllamaInstalled();
    if (!installed) {
      // Not installed — send the user to the download page.
      const action = await vscode.window.showWarningMessage(
        "Sensei needs Ollama to work. Please install it.",
        "Download Ollama",
      );
      if (action === "Download Ollama") {
        if(operating_system=="win32"){
          exec('powershell.exe -Command "irm https://ollama.com/install.ps1 | iex"',(error,stdout,stderr)=>{if(error) console.error(error)});
        }
        if(operating_system=="darwin" || operating_system=="linux"){
          exec('curl -fsSL https://ollama.com/install.sh | sh',(error,stdout,stderr)=>{if(error) console.error(error)});
        }
        
      }
      vscode.window.showInformationMessage(
        "After installing Ollama, reload VS Code to activate Sensei.",
      );
      return;
    }

    // Installed but not running — offer to start it.
    const action = await vscode.window.showWarningMessage(
      "Ollama is installed but not running.",
      "Start Ollama",
    );
    if (action === "Start Ollama") {
      const started = await startOllama();
      if (!started) {
        vscode.window.showWarningMessage(
          "Ollama could not start. Please run `ollama serve` manually.",
        );
      }
    }
  }

  const config = vscode.workspace.getConfiguration("sensei");
  const selectedModel = config.get<string>("model");

  if (!selectedModel) {
    // First run — show the setup flow and stop here. The user reloads after.
    setupPanel(context);
    return;
  }

  StatusBarManager.init(context);
  registerSetIntent(context);
  registerResetSession(context);
  intentTracker.init(context);
  hintDelivery.init(context);
  codeWatcher.start(context);

  if (vscode.window.activeTextEditor) {
    void intentTracker.promptForIntent(vscode.window.activeTextEditor.document);
  }

  vscode.window.showInformationMessage(
    `Sensei is watching. Model: ${selectedModel}`,
  );
}


export function deactivate() {}
