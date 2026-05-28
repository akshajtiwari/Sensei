import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;

export const StatusBarManager = {
  init(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100,
    );
    statusBarItem.text = "$(eye) Sensei";
    statusBarItem.tooltip = "Sensei is watching";
    statusBarItem.command = "sensei.setIntent";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
  },

  setHint(hint: string): void {
    statusBarItem.text = `$(lightbulb) ${hint}`;
    statusBarItem.tooltip = hint;
    // Reset back after 8 seconds
    setTimeout(() => {
      statusBarItem.text = "$(eye) Sensei";
      statusBarItem.tooltip = "Sensei is watching";
    }, 8000);
  },

  setSilent(): void {
    statusBarItem.text = "$(eye) Sensei";
    statusBarItem.tooltip = "Sensei is watching";
  },
};
