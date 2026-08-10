
import * as vscode from "vscode";
import * as intentTracker from "./../core/intentTracker";

export function registerSetIntent(context: vscode.ExtensionContext): void {
  const cmd = vscode.commands.registerCommand("sensei.setIntent", async () => {
    // LEARN: the file the user is looking at. Could be undefined (no editor).
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("Sensei: open a file first.");
      return;
    }

    const input = await vscode.window.showInputBox({
      prompt: "What are we building in this file?",
      placeHolder: "e.g. a REST endpoint to create users",
      ignoreFocusOut: true, // don't vanish if focus moves
    });

    if (input && input.trim()) {
      intentTracker.setIntent(editor.document.uri, input.trim());
      vscode.window.showInformationMessage(`Sensei: got it — "${input.trim()}"`);
    }
  });

  context.subscriptions.push(cmd);
}

// Registers "Sensei: Reset Session" — clears the intent for the active file.
export function registerResetSession(context: vscode.ExtensionContext): void {
  const cmd = vscode.commands.registerCommand("sensei.resetSession", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    intentTracker.clear(editor.document.uri);
    vscode.window.showInformationMessage("Sensei: intent cleared for this file.");
  });

  context.subscriptions.push(cmd);
}
