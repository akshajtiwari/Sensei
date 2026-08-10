
import * as vscode from "vscode";

// LEARN: This runs once, when the file is first loaded. `createOutputChannel`
// makes the "Sensei" entry in VS Code's Output panel (View -> Output).
// `const` means this binding never gets reassigned to a different channel.
const channel = vscode.window.createOutputChannel("Sensei");


export const logger = {

  // compile if someone calls logger.info(42).
  info: (msg: string) => channel.appendLine(`[INFO]  ${msg}`),
  warn: (msg: string) => channel.appendLine(`[WARN]  ${msg}`),
  error: (msg: string) => channel.appendLine(`[ERROR] ${msg}`),

};
