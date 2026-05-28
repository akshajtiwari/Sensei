const OLLAMA_BASE = "http://localhost:11434";

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE}`); ///api/tags
    return res.ok;
  } catch {
    return false;
  }
}
