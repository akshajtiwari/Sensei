
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {

  // Its type is "a timeout handle OR null". `| null` is a UNION type.
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    // If a call is already waiting, cancel it — we only want the last one.
    if (timer) {
      clearTimeout(timer);
    }
    // Schedule the real work for `delayMs` from now.
    timer = setTimeout(() => {
      fn(...args); // `...args` spreads the saved arguments back into fn.
    }, delayMs);
  };
}

