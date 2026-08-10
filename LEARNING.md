# Learning Sensei — your build-to-learn roadmap

Welcome. Sensei is now a complete VS Code extension. This file is kept as a guided tour of
how its simple TypeScript, VS Code API, and local Ollama integration fit together.

You already know how to program — so this doc explains the *TypeScript/VS Code specific* things
as you meet them, and gets out of your way otherwise.

---

## The two promises

1. **It always builds and runs.** Even before you've written a line, `npm run compile` succeeds
   and pressing **F5** launches the extension. Features switch on as you complete stages. You will
   never be stuck staring at a broken build you didn't cause.
2. **Everything you need to do is marked in the code.** Search the codebase for these markers:

   | Marker | Meaning |
   | --- | --- |
   | `// LEARN:` | An explanation of a concept, right where it's used. Just read it. |
   | `// TODO(you):` | A blank you must fill in. |
   | `// BUG(you):` | A planted bug. Find it, understand it, fix it. |
   | `// HINT 1:` `HINT 2:` `HINT 3:` | Graded hints: nudge → approach → almost-the-answer. Use only as many as you need. |

   Tip: in VS Code press `Ctrl+Shift+F` and search for `TODO(you)` or `BUG(you)` to see every
   open task at once.

---

## How to run things

```bash
npm install          # one time — downloads dev tools (already done if node_modules/ exists)
npm run compile      # type-check + build src/ -> out/   (run this after any edit)
npm run watch        # same, but rebuilds automatically while you work
npm test             # build, then run the test suite (this is your red/green feedback)
npm run lint         # style/quality checks
```

To try the extension for real: open this folder in VS Code and press **F5**. A second VS Code
window ("Extension Development Host") opens with Sensei loaded. Also install **Ollama**
(https://ollama.com) and run `ollama serve` for the AI parts.

**Your feedback loop:** run `npm test`. Some tests are **green** (my reference code) and some are
**red** (your unfinished tasks). Each stage below tells you which tests should turn green when you're
done. Green tests = that piece works.

---

## The ladder — do these in order

Each stage gets a little harder. Check the boxes as you go.

### ☑ Stage 0 — Orientation (just read)
No coding. Read these files top to bottom and follow every `// LEARN:` note:
- `src/utils/logger.ts` — modules, `export`, arrow functions
- `src/utils/debounce.ts` — **generics** (`<T>`), closures, function types
- `src/ui/statusBar.ts` — objects with methods, the VS Code status bar
- `src/utils/systemCheck.ts` — `interface`, `async`/`await`, `Promise`
- `src/ollama/ollamaClient.ts` — `fetch`, talking to Ollama, typing a JSON response

**Done when:** `npm run compile` passes and you can explain, in your own words, what a *generic*
and a *Promise* are.

### ☑ Stage 1 — Fix the planted bugs (async & types)
There are three planted problems, all marked `BUG(you)`:
- `src/utils/systemCheck.ts` → `recommendTier()` has an off-by-one. A red test points right at it. 
- `src/ollama/modelManager.ts` → `pullModel()` says "done" before the download finishes, and
  `parsePullProgress()` (red test) returns the wrong number.
- `src/extension.ts` → the "Start Ollama" button runs the wrong command and there are unused imports.

**Concepts:** `async/await`, why a `Promise` can resolve too early, reading a stream, `spawn` vs `exec`.
**Done when:** the Stage-1 tests are green (`npm test`) and, in F5, "Start Ollama" actually starts it.

### ☑ Stage 2 — Fill in `intentTracker` (Map, state, undefined)
`src/core/intentStore.ts` is a small class that remembers "what are we building?" per file. I wrote
`get()`; you write `set()` and `clear()` (marked `TODO(you)`, red tests waiting). Then finish
`src/core/intentTracker.ts` (`setIntent`, `clear`, `promptForIntent`).

**Concepts:** `Map<K, V>`, `undefined` vs a real value, persisting data with `workspaceState`.
**Done when:** Stage-2 tests are green and, in F5, opening a new file asks "What are we building?" and
remembers your answer after a reload.

### ☑ Stage 3 — Fill in `hintDelivery` (events & squiggles)
`src/core/hintFormat.ts` has pure helpers (`formatHint`, `isDuplicate`) with red tests to make green.
Then `src/core/hintDelivery.ts` turns a hint into an inline squiggle on the right line.

**Concepts:** `DiagnosticCollection`, `Range`, diagnostic severities, disposables.
**Done when:** Stage-3 tests are green and, in F5, a `💡 Sensei:` squiggle can appear on a line.

### ☑ Stage 4 — Build `driftDetector` from scratch (the brain) 🧠
This is the heart of Sensei. I give you the shape (`DriftResult`) and tests for the parser; you write
the prompt to the model and the parsing. `src/core/driftDetector.ts` has the spec.

**Concepts:** building a prompt with template strings, asking Ollama for JSON, `JSON.parse` +
checking untrusted data, defaulting to "no hint" when unsure.
**Done when:** Stage-4 parser tests are green and, in F5, writing off-topic code produces a *question*,
never code.

### ☑ Stage 5 — Build `codeWatcher` from scratch (the loop) 🔁
Ties it all together: watch typing, wait until you pause, then run the brain and deliver a hint.
`src/core/codeWatcher.ts` has the spec; `src/core/analysisGate.ts` has a pure helper with red tests.

**Concepts:** the `onDidChangeTextDocument` event, a per-file debounce, closures, skipping no-op edits.
**Done when:** Stage-5 tests are green and, in F5, hints appear ~2s after you pause on off-topic code
and stay silent when your code matches your intent.

### ☑ Stage 6 — Setup webview
Replace the plain dropdown onboarding with a real HTML panel showing your RAM and a live download bar.
`src/ui/setupPanel.ts` and `media/setup.html` have the spec and `TODO(you)` markers.

**Concepts:** webviews, sending messages between the panel and the extension, content security policy.

---

## Where to look when stuck

1. Read the nearest `// LEARN:` note — it's usually the exact concept you need.
2. Reveal `HINT 1`, then `HINT 2`, then `HINT 3` in that file, one at a time.
3. Read a nearby file I fully wrote (e.g. `logger.ts`, `debounce.ts`) as a worked example.
4. Run `npm test` — the failing test's message describes the exact behavior expected.
5. The full technical target for every module is in `plans/architecture.md`.

You've got this. Fix one red test at a time.
