
export interface Hint {
  line: number;
  text: string;
}


export function formatHint(text: string): string {
  return `💡 Sensei: ${text}`;
}



export function isDuplicate(previous: Hint | null, next: Hint): boolean {
  if (previous === null) {
    return false;
  }

  return previous.line === next.line && previous.text === next.text;
}
