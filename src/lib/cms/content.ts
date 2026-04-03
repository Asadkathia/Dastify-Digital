export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const texts: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') {
      return;
    }

    const record = node as Record<string, unknown>;

    if (typeof record.text === 'string') {
      texts.push(record.text);
    }

    const children = record.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        walk(child);
      }
    }

    const root = record.root;
    if (root) {
      walk(root);
    }
  };

  walk(value);
  return texts.join(' ').replace(/\s+/g, ' ').trim();
}
