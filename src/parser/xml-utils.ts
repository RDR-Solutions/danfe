/**
 * Normalize parsed XML object: keys may be with namespace (e.g. "nfe:NFe") or
 * single element may be parsed as array. We want a consistent shape for mappers.
 */
export function first<T>(value: T | T[] | undefined | null): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Get string from object, handling attribute vs element (parser may put text in #text) */
export function getText(obj: unknown): string | undefined {
  if (obj == null) return undefined;
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object' && obj !== null && '#text' in obj) {
    const t = (obj as { '#text'?: string })['#text'];
    return typeof t === 'string' ? t : undefined;
  }
  return undefined;
}

/** Read string from node (node can be object with #text or direct string) */
export function nodeText(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string') return node.trim();
  if (typeof node === 'object' && node !== null && '#text' in node) {
    const t = (node as { '#text'?: string })['#text'];
    return typeof t === 'string' ? t.trim() : '';
  }
  return '';
}
