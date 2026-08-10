
import * as vscode from "vscode";
import { formatHint, isDuplicate, Hint } from "./hintFormat";


let collection: vscode.DiagnosticCollection;


const lastHints = new Map<string, Hint>();

export function init(context: vscode.ExtensionContext): void {
  collection = vscode.languages.createDiagnosticCollection("sensei");
  context.subscriptions.push(collection);
}


function buildDiagnostic(hint: Hint): vscode.Diagnostic {
  const range = new vscode.Range(hint.line, 0, hint.line, Number.MAX_SAFE_INTEGER);
  const diagnostic = new vscode.Diagnostic(
    range,
    formatHint(hint.text),
    vscode.DiagnosticSeverity.Information,
  );
  diagnostic.source = "Sensei";
  return diagnostic;
}


export function showHint(document: vscode.TextDocument, hint: Hint): void {
  const key = document.uri.toString();
  const previous = lastHints.get(key) ?? null;
  if (isDuplicate(previous, hint)) {
    return;
  }

  collection.set(document.uri, [buildDiagnostic(hint)]);
  lastHints.set(key, hint);
}


export function clearHint(document: vscode.TextDocument): void {
  collection.delete(document.uri);
  lastHints.delete(document.uri.toString());
}
