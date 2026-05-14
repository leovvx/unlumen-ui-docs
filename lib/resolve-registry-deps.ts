import { index as registryIndex } from "@/__registry__";

type RegistryEntry = Record<string, any>;

const registry = registryIndex as Record<string, RegistryEntry>;

/**
 * Recursively collect all registry dependency entries (including transitive).
 * Returns `{ key, entry }[]` where `key` is the bare registry name.
 */
export function resolveRegistryDeps(
  rootName: string,
): { key: string; entry: RegistryEntry }[] {
  const rootEntry = registry[rootName];
  if (!rootEntry) return [];

  const seen = new Set<string>();
  const results: { key: string; entry: RegistryEntry }[] = [];

  function collect(depNames: string[]) {
    for (const dep of depNames) {
      const key = dep.replace(/^@unlumen-ui\//, "");
      if (seen.has(key)) continue;
      seen.add(key);
      const entry = registry[key];
      if (!entry) continue;
      results.push({ key, entry });
      if (entry.registryDependencies?.length) {
        collect(entry.registryDependencies);
      }
    }
  }

  collect(rootEntry.registryDependencies ?? []);
  return results;
}

/**
 * Clean display name from a registry key.
 * e.g. "hooks-use-controlled-state" → "use-controlled-state"
 */
export function registryDisplayName(key: string): string {
  return key.replace(/^primitives-[a-z]+-/, "").replace(/^(?:lib|hooks)-/, "");
}
