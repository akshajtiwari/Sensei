
export function hashText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    // `hash * 33 + charCode`, kept in 32-bit range with `| 0`.
    hash = (hash * 33 + text.charCodeAt(i)) | 0;
  }
  return String(hash);
}


export function shouldAnalyze(
  previousHash: string | null,
  nextText: string,
): boolean {
  if (previousHash === null) {
    return true;
  }

  return hashText(nextText) !== previousHash;
}
