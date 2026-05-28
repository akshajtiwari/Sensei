const OLLAMA_BASE = "http://localhost:11434";

export const MODEL_TIERS = {
  minimum: "qwen2.5-coder:0.5b",
  average: "qwen2.5-coder:1.5b",
  good: "qwen2.5-coder:3b",
} as const;

export type ModelTier = keyof typeof MODEL_TIERS;

export async function pullModel( //create a function to download model
  modelName: string,
  onProgress: (status: string) => void,
): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: modelName,
        stream: true,
      }),
    });

    if (!res.ok) {
      return false;
    }

    onProgress(`Model ${modelName} downloaded successfully.`);
    return true;
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
