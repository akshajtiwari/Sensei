
const OLLAMA_BASE = "http://localhost:11434";


export interface GenerateOptions {

  format?: "json";
}


export async function generate(
  model: string,
  prompt: string,
  options: GenerateOptions = {}, // default value: an empty object if omitted
): Promise<string> {
  try {
   
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // LEARN: JSON.stringify turns a JS object into a JSON string to send.
      body: JSON.stringify({
        model,
        prompt,
        stream: false, // false = wait for the whole answer, not token-by-token
       
        format: options.format,
      }),
    });

    if (!res.ok) {
      return ""; // server error -> return empty; callers treat "" as "no answer"
    }

   
    const data = (await res.json()) as { response: string };

  
    return data.response?.trim() ?? "";
  } catch {
    return "";
  }
}
