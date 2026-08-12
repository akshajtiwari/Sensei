const OLLAMA_BASE = "http://localhost:11434";


export const MODEL_TIERS = {
  minimum: "qwen2.5-coder:0.5b",
  average: "qwen2.5-coder:1.5b",
  good: "qwen2.5-coder:3b",
} as const;


export type ModelTier = keyof typeof MODEL_TIERS;


export function parsePullProgress(line: string): number {
  try {
    const data = JSON.parse(line) as { completed?: number; total?: number };
    if (!data.total || data.total <= 0 || data.completed == null) {
      return 0;
    }
    const percent = Math.round((data.completed / data.total) * 100);
    return Math.max(0, Math.min(100, percent));
  } catch {
    return 0; // not valid JSON -> no progress info
  }
}



export async function pullModel(
  modelName: string,
  onProgress: (status: string) => void,
): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName, stream: true }),
    });


    if (!res.ok || !res.body) {
      return false;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    let finished = false;
    while (!finished) {
      const part = await reader.read();
      finished = part.done;
      buffer += decoder.decode(part.value, { stream: !part.done });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      if (part.done && buffer.trim()) {
        lines.push(buffer);
        buffer = "";
      }

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const data = JSON.parse(line) as { status?: string };
        const percent = parsePullProgress(line);
        onProgress(`${percent}%`);

        if (data.status === "success") {
          onProgress(`Model ${modelName} downloaded successfully.`);
          return true;
        }
      }

      if (part.done) {
        break;
      }
    }

    return false;
  } catch {
    return false;
  }
}

export async function listLocalModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`);
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as { models: { name: string }[] };
    return data.models.map((m) => m.name);
  } catch {
    return [];
  }
}
