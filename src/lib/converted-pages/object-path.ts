function isIndexSegment(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export function getValueAtPath(source: unknown, path: string): unknown {
  if (!path) return source;
  const parts = path.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (current == null) return undefined;
    if (Array.isArray(current) && isIndexSegment(part)) {
      current = current[Number(part)];
      continue;
    }
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

export function setValueAtPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.');
  let cursor: unknown = target;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]!;
    const nextPart = parts[i + 1]!;

    if (Array.isArray(cursor) && isIndexSegment(part)) {
      const index = Number(part);
      const existing = cursor[index];
      if (existing == null || typeof existing !== 'object') {
        cursor[index] = isIndexSegment(nextPart) ? [] : {};
      }
      cursor = cursor[index];
      continue;
    }

    const obj = cursor as Record<string, unknown>;
    const existing = obj[part];
    if (existing == null || typeof existing !== 'object') {
      obj[part] = isIndexSegment(nextPart) ? [] : {};
    }
    cursor = obj[part];
  }

  const last = parts[parts.length - 1]!;
  if (Array.isArray(cursor) && isIndexSegment(last)) {
    cursor[Number(last)] = value;
  } else {
    (cursor as Record<string, unknown>)[last] = value;
  }
}

export function sanitizeNodeKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'node';
}
