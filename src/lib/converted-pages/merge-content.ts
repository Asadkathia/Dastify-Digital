function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return value == null ? value : structuredClone(value);
}

// Legacy-shape migration shim. Several converted pages had their section keys
// refactored after marketing had already saved overrides under the old shape.
// To avoid orphaned overrides on prod (and forcing marketing to re-enter copy),
// we transform old-shape overrides into the new shape on-the-fly before the
// merge runs. Idempotent: on already-new-shape data, every branch is a no-op.
//
// Pages affected:
// 1. /contact — `main.{form,info}` → top-level `form` + `info`
// 2. /book-session — `main.{scheduler,form,sidebar}` → top-level
// 3. /blog (registry: blog-1) — `main.{posts,categories}` → top-level
// 4. /services (registry: services-convert) — `specialties.tabContent` (object
//    map keyed by slug) merged into `specialties.tabs[].{headline,description,bullets}`
//    by slug match
function migrateLegacyShape(
  pageName: string | undefined,
  override: Record<string, unknown>,
): Record<string, unknown> {
  if (!pageName) return override;
  const next = { ...override };

  // Pages that lifted `main.<x>` to top-level `<x>`.
  type LiftSpec = { from: string; keys: string[] };
  const liftSpecs: Record<string, LiftSpec | undefined> = {
    contact: { from: 'main', keys: ['form', 'info'] },
    'book-session': { from: 'main', keys: ['scheduler', 'form', 'sidebar'] },
    'blog-1': { from: 'main', keys: ['posts', 'categories'] },
  };

  const spec = liftSpecs[pageName];
  if (spec) {
    const wrapper = next[spec.from];
    if (isPlainObject(wrapper)) {
      const wrapperRest: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(wrapper)) {
        if (spec.keys.includes(k)) {
          // Only lift when the new top-level key is absent — never clobber a
          // genuinely-new override that was saved post-refactor.
          if (next[k] === undefined) next[k] = v;
        } else {
          wrapperRest[k] = v;
        }
      }
      // Preserve any non-lifted keys under the original wrapper (e.g. `meta`),
      // or drop the wrapper entirely if it's now empty.
      if (Object.keys(wrapperRest).length > 0) {
        next[spec.from] = wrapperRest;
      } else {
        delete next[spec.from];
      }
    }
  }

  // services-convert: specialties.tabContent (slug → { headline, description,
  // bullets }) merged into specialties.tabs[i] by matching slug.
  if (pageName === 'services-convert') {
    const specialties = next.specialties;
    if (isPlainObject(specialties)) {
      const tabContent = specialties.tabContent;
      const tabs = specialties.tabs;
      if (isPlainObject(tabContent) && Array.isArray(tabs)) {
        const mergedTabs = tabs.map((tab) => {
          if (!isPlainObject(tab)) return tab;
          const slug = typeof tab.slug === 'string' ? tab.slug : '';
          const fromMap = slug ? tabContent[slug] : undefined;
          if (!isPlainObject(fromMap)) return tab;
          // Don't overwrite fields that are already present on the new-shape tab.
          const merged: Record<string, unknown> = { ...tab };
          for (const [k, v] of Object.entries(fromMap)) {
            if (merged[k] === undefined) merged[k] = v;
          }
          return merged;
        });
        const { tabContent: _drop, ...rest } = specialties;
        next.specialties = { ...rest, tabs: mergedTabs };
      }
    }
  }

  return next;
}

export function mergeConvertedContent<T>(
  fallback: T,
  override: unknown,
  pageName?: string,
): T {
  if (override == null) return cloneValue(fallback);

  // Legacy-shape migration runs once at the top level on the override only.
  // Nested merge calls don't pass pageName, so this is a one-shot transform.
  const effectiveOverride =
    pageName && isPlainObject(override)
      ? migrateLegacyShape(pageName, override)
      : override;

  if (Array.isArray(fallback)) {
    if (!Array.isArray(effectiveOverride)) return cloneValue(fallback);
    if (effectiveOverride.length === 0) return [] as T;

    return Array.from({ length: effectiveOverride.length }, (_, index) =>
      mergeConvertedContent(fallback[index], effectiveOverride[index]),
    ) as T;
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(effectiveOverride)) return cloneValue(fallback);
    const result: Record<string, unknown> = {};
    const keys = new Set([...Object.keys(fallback), ...Object.keys(effectiveOverride)]);

    for (const key of keys) {
      result[key] = mergeConvertedContent(
        (fallback as Record<string, unknown>)[key],
        (effectiveOverride as Record<string, unknown>)[key],
      );
    }

    return result as T;
  }

  return cloneValue((effectiveOverride ?? fallback) as T);
}
