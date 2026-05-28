const OLLAMA_BASE = 'http://localhost:11434';

export async function generate(model: string, prompt: string): Promise<string> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      })
    });

    if (!res.ok) { return ''; }

    const data = await res.json() as { response: string };
    return data.response?.trim() ?? '';
  } catch {
    return '';
  }
}
