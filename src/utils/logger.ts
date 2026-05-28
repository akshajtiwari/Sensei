import * as vscode from "vscode";

const channel = vscode.window.createOutputChannel("Sensei");

export const logger = {
  info: (msg: string) => channel.appendLine(`[INFO]  ${msg}`),
  warn: (msg: string) => channel.appendLine(`[WARN]  ${msg}`),
  error: (msg: string) => channel.appendLine(`[ERROR] ${msg}`),
};
