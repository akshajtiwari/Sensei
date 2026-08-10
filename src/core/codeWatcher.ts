
import * as vscode from "vscode";
import * as intentTracker from "./intentTracker";
import * as hintDelivery from "./hintDelivery";
import { analyze } from "./driftDetector";
import { shouldAnalyze, hashText } from "./analysisGate";
import { StatusBarManager } from "../ui/statusBar";

const DEBOUNCE_MS = 2000; // wait this long after typing stops before analyzing


const timers = new Map<string, ReturnType<typeof setTimeout>>();

const lastHashes = new Map<string, string | null>();


export function start(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      scheduleAnalysis(event.document);
    }),
  );

  context.subscriptions.push({
    dispose: () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
      lastHashes.clear();
    },
  });
}


function scheduleAnalysis(document: vscode.TextDocument): void {
  const key = document.uri.toString();
  const oldTimer = timers.get(key);
  if (oldTimer) {
    clearTimeout(oldTimer);
  }

  const timer = setTimeout(() => {
    timers.delete(key);
    void analyzeDocument(document);
  }, DEBOUNCE_MS);
  timers.set(key, timer);
}

async function analyzeDocument(document: vscode.TextDocument): Promise<void> {
  if (document.uri.scheme !== "file") {
    return;
  }

  const intent = intentTracker.getIntent(document.uri);
  if (!intent) {
    return;
  }

  const code = document.getText();
  const key = document.uri.toString();
  const previousHash = lastHashes.get(key) ?? null;
  if (!shouldAnalyze(previousHash, code)) {
    return;
  }

  const model = vscode.workspace
    .getConfiguration("sensei")
    .get<string>("model");
  if (!model) {
    return;
  }

  lastHashes.set(key, hashText(code));
  StatusBarManager.setThinking();

  try {
    const result = await analyze(model, intent, code);
    if (result.drift && result.line !== null) {
      const lastLine = Math.max(0, document.lineCount - 1);
      const line = Math.min(result.line, lastLine);
      hintDelivery.showHint(document, { line, text: result.hint });
    } else {
      hintDelivery.clearHint(document);
    }
  } finally {
    StatusBarManager.setWatching();
  }
}
