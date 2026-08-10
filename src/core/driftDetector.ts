
import { generate } from "../ollama/ollamaClient";


export interface DriftResult {
  drift: boolean;
  line: number | null;
  hint: string;
}

export const NO_DRIFT: DriftResult = { drift: false, line: null, hint: "" };


export function buildDriftPrompt(intent: string, code: string): string {
  const numberedCode = code
    .split("\n")
    .map((line, index) => `${index}: ${line}`)
    .join("\n");

  return `You are a quiet coding teacher.

The learner's intent is:
${intent}

Their code is below. Each line starts with its zero-based line number:
${numberedCode}

Decide whether the code is moving away from the intent.
Rules:
- Never give code or a complete solution.
- Give only one short question or nudge.
- If the code looks fine, set drift to false.
- If you are unsure, set drift to false.
- When drift is false, use null for line and an empty hint.

Reply with only one JSON object in this exact shape:
{"drift": boolean, "line": number|null, "hint": string}

Examples:
{"drift":false,"line":null,"hint":""}
{"drift":true,"line":3,"hint":"Do you need a second loop here?"}`;
}


export function parseDriftResponse(raw: string): DriftResult {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end < start) {
    return NO_DRIFT;
  }

  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      drift?: unknown;
      line?: unknown;
      hint?: unknown;
    };

    if (parsed.drift !== true || typeof parsed.hint !== "string") {
      return NO_DRIFT;
    }

    const hint = parsed.hint.trim();
    if (!hint || hint.includes("```")) {
      return NO_DRIFT;
    }

    const line =
      typeof parsed.line === "number" &&
      Number.isInteger(parsed.line) &&
      parsed.line >= 0
        ? parsed.line
        : null;

    return { drift: true, line, hint };
  } catch {
    return NO_DRIFT;
  }
}


export async function analyze(
  model: string,
  intent: string,
  code: string,
): Promise<DriftResult> {
  const prompt = buildDriftPrompt(intent, code);
  const raw = await generate(model, prompt, { format: "json" });
  return parseDriftResponse(raw);
}
