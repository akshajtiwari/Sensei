
import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;


export const StatusBarManager = {

  init(context: vscode.ExtensionContext): void {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100, // priority — higher shows further left among right-aligned items
    );
    statusBarItem.text = "$(eye) Sensei"; // $(eye) renders a built-in icon
    statusBarItem.tooltip = "Sensei is watching";
    statusBarItem.command = "sensei.setIntent"; // clicking runs this command
    statusBarItem.show();
    
    context.subscriptions.push(statusBarItem);
  },

  // Ambient state helpers. Call these from the watcher/detector later.
  setThinking(): void {
    statusBarItem.text = "$(sync~spin) Sensei thinking…"; // ~spin animates it
    statusBarItem.tooltip = "Sensei is analyzing your code";
  },

  setWatching(): void {
    statusBarItem.text = "$(eye) Sensei";
    statusBarItem.tooltip = "Sensei is watching";
  },
};
