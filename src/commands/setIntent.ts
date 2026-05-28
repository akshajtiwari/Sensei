import * as vscode from "vscode";

// Stores intent per workspace session (in-memory for now)
let currentIntent: string | null = null;

export function getCurrentIntent(): string | null {
  return currentIntent;
}

export function registerSetIntent(context: vscode.ExtensionContext): void {
  const cmd = vscode.commands.registerCommand("sensei.setIntent", async () => {
    const input = await vscode.window.showInputBox({
      prompt: "What are you building?",
      placeHolder: "e.g. a program to add two numbers",
      ignoreFocusOut: true,
    });

    if (input && input.trim()) {
      currentIntent = input.trim();
      vscode.window.showInformationMessage(
        `Sensei: Got it. Building "${currentIntent}"`,
      );
    }
  });

  context.subscriptions.push(cmd);
}

export function registerResetSession(context: vscode.ExtensionContext): void {
  const cmd = vscode.commands.registerCommand("sensei.resetSession", () => {
    currentIntent = null;
    vscode.window.showInformationMessage("Sensei: Session reset.");
  });

  context.subscriptions.push(cmd);
}
