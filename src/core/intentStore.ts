

export class IntentStore {
  private intents = new Map<string, string>();

  get(key: string): string | undefined {
    return this.intents.get(key);
  }

  
  set(key: string, value: string): void {
    this.intents.set(key, value);
  }


  clear(key: string): void {
    this.intents.delete(key);
  }


  entries(): [string, string][] {
    return Array.from(this.intents);
  }

  load(saved: [string, string][]): void {
    for (const [key, value] of saved) {
      this.intents.set(key, value);
    }
  }
}
