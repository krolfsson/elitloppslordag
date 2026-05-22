/** Första emoji-tecknet (inkl. ZWJ-sekvenser) */
export function parseFirstEmoji(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/\p{Extended_Pictographic}(\uFE0F?\u200D\p{Extended_Pictographic})*/u);
  return match ? match[0] : null;
}

export function normalizeEmoji(input: string, fallback: string): string {
  return parseFirstEmoji(input) ?? fallback;
}
