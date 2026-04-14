function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return value == null ? value : structuredClone(value);
}

export function mergeConvertedContent<T>(fallback: T, override: unknown): T {
  if (override == null) return cloneValue(fallback);

  if (Array.isArray(fallback)) {
    if (!Array.isArray(override)) return cloneValue(fallback);
    if (override.length === 0) return [] as T;

    return Array.from({ length: override.length }, (_, index) =>
      mergeConvertedContent(fallback[index], override[index]),
    ) as T;
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(override)) return cloneValue(fallback);
    const result: Record<string, unknown> = {};
    const keys = new Set([...Object.keys(fallback), ...Object.keys(override)]);

    for (const key of keys) {
      result[key] = mergeConvertedContent(
        (fallback as Record<string, unknown>)[key],
        (override as Record<string, unknown>)[key],
      );
    }

    return result as T;
  }

  return cloneValue((override ?? fallback) as T);
}
