// ===========================================================================
// intentTracker.ts  —  connects the pure IntentStore to VS Code: persistence,
// the "What are we building?" prompt, and per-file lookups.
// STATUS: Stage 2 GUIDED PLACEHOLDER. init() + getIntent() are written for you;
//         you implement setIntent(), clear(), and promptForIntent().
// ===========================================================================
import * as vscode from "vscode";
import { IntentStore } from "./intentStore";

// LEARN: Module-level state. These live as long as the extension runs.
const store = new IntentStore();
const asked = new Set<string>(); // files we've already prompted, so we ask once
const STATE_KEY = "sensei.intents"; // the key we save intents under on disk

// LEARN: We stash `context` here in init() so the other functions can save to
// disk without every caller having to pass it around. `| undefined` because it
// isn't set until init runs.
let context: vscode.ExtensionContext | undefined;

// LEARN (reference): called once from extension.ts. It (1) remembers context,
// (2) reloads saved intents from disk, and (3) starts prompting when you switch
// to a fresh file.
export function init(ctx: vscode.ExtensionContext): void {
  context = ctx;

  // Reload intents saved in a previous session. `get(key, default)` returns the
  // default (here an empty array) if nothing was saved yet.
  const saved = ctx.workspaceState.get<[string, string][]>(STATE_KEY, []);
  store.load(saved);

  // When you switch to another editor, maybe prompt for its intent.
  ctx.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        promptForIntent(editor.document);
      }
    }),
  );
}

// LEARN (reference): look up the intent for a document. Returns undefined if
// this file has no intent yet.
export function getIntent(uri: vscode.Uri): string | undefined {
  return store.get(uri.toString());
}


function isEligible(document: vscode.TextDocument): boolean {
  return document.uri.scheme === "file";
}

function persist(): void {
  context?.workspaceState.update(STATE_KEY, store.entries());
}



export function setIntent(uri: vscode.Uri, text: string): void {
  store.set(uri.toString(), text);
  persist();
}

export function clear(uri: vscode.Uri): void {
  const key = uri.toString();
  store.clear(key);
  asked.delete(key);
  persist();
}


export async function promptForIntent(document: vscode.TextDocument): Promise<void> {
  if (!isEligible(document)) {
    return;
  }

  const key = document.uri.toString();
  if (asked.has(key) || getIntent(document.uri)) {
    return;
  }

  asked.add(key);
  const answer = await vscode.window.showInputBox({
    prompt: "What are we building in this file?",
    placeHolder: "e.g. a REST endpoint to create users",
    ignoreFocusOut: true,
  });

  if (answer && answer.trim()) {
    setIntent(document.uri, answer.trim());
  }
}
