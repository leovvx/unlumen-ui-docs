import { builtinModules } from "node:module";
import path from "path";
import { promises as fs } from "fs";
import {
  appRoot,
  getGalleryComponentNames,
  getRegistryFilePath,
  getRegistryItemsFromFolder,
  normalizeRegistryDependency,
  registryRoot,
  resolveFromAppRoot,
} from "./lib/registry-utils.mts";

const builtins = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

const implicitlyAvailablePackages = new Set(["react", "react-dom"]);
const installableRegistryTypes = new Set([
  "registry:ui",
  "registry:block",
  "registry:lib",
  "registry:hook",
]);

function isExternalRegistryDependency(dependency: string): boolean {
  return /^https?:\/\//.test(dependency);
}

function isInstallableItem(itemType: string | undefined): boolean {
  return itemType ? installableRegistryTypes.has(itemType) : false;
}

function toLocalRegistryDependency(
  dependency: string,
  itemNames: Set<string>,
): string | null {
  if (isExternalRegistryDependency(dependency)) {
    return null;
  }

  if (dependency.startsWith("@unlumen-ui/")) {
    return normalizeRegistryDependency(dependency);
  }

  return itemNames.has(dependency) ? dependency : null;
}

function packageNameFromSpecifier(specifier: string): string {
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return scope && name ? `${scope}/${name}` : specifier;
  }
  return specifier.split("/")[0] ?? specifier;
}

function collectExternalImports(source: string): Set<string> {
  const imports = new Set<string>();
  const patterns = [
    /import\s+[^'"`]*?from\s+['"]([^'"]+)['"]/g,
    /export\s+[^'"`]*?from\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (!specifier) continue;
      if (
        specifier.startsWith("./") ||
        specifier.startsWith("../") ||
        specifier.startsWith("@/") ||
        specifier.startsWith("@workspace/") ||
        specifier.startsWith("http://") ||
        specifier.startsWith("https://")
      ) {
        continue;
      }

      const packageName = packageNameFromSpecifier(specifier);
      if (builtins.has(packageName) || builtins.has(specifier)) {
        continue;
      }

      imports.add(packageName);
    }
  }

  return imports;
}

function findDependencyCycles(graph: Map<string, string[]>): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const stack = new Set<string>();
  const trail: string[] = [];

  function walk(node: string) {
    visited.add(node);
    stack.add(node);
    trail.push(node);

    for (const next of graph.get(node) ?? []) {
      if (!visited.has(next)) {
        walk(next);
        continue;
      }

      if (stack.has(next)) {
        const cycleStart = trail.indexOf(next);
        cycles.push([...trail.slice(cycleStart), next]);
      }
    }

    trail.pop();
    stack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      walk(node);
    }
  }

  return cycles;
}

async function main() {
  const items = await getRegistryItemsFromFolder();
  const errors: string[] = [];
  const itemMap = new Map<string, (typeof items)[number]>();

  for (const item of items) {
    if (itemMap.has(item.name)) {
      errors.push(`Duplicate registry item name: ${item.name}`);
      continue;
    }
    itemMap.set(item.name, item);
  }

  for (const galleryName of getGalleryComponentNames()) {
    if (!itemMap.has(galleryName)) {
      errors.push(
        `Gallery component is missing a registry item: ${galleryName}`,
      );
    }
  }

  const itemNames = new Set(itemMap.keys());
  const dependencyGraph = new Map<string, string[]>();

  for (const item of items) {
    const installableItem =
      !item.name.startsWith("demo-") && isInstallableItem(item.type);

    if (!item.type) {
      errors.push(`Registry item ${item.name} is missing a type`);
    }
    if (installableItem && !item.title) {
      errors.push(`Registry item ${item.name} is missing a title`);
    }
    if (!Array.isArray(item.files) || item.files.length === 0) {
      errors.push(`Registry item ${item.name} must declare at least one file`);
      dependencyGraph.set(item.name, []);
      continue;
    }

    const normalizedDependencies = (item.registryDependencies ?? [])
      .map((dependency) => toLocalRegistryDependency(dependency, itemNames))
      .filter((dependency): dependency is string => dependency !== null);

    dependencyGraph.set(item.name, normalizedDependencies);

    for (const dependencyName of normalizedDependencies) {
      if (!itemMap.has(dependencyName)) {
        errors.push(
          `Registry item ${item.name} references missing registry dependency ${dependencyName}`,
        );
      }
    }

    const declaredPackages = new Set(
      [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].map(
        packageNameFromSpecifier,
      ),
    );

    for (const file of item.files) {
      const relativePath = getRegistryFilePath(file);
      const absolutePath = resolveFromAppRoot(relativePath);

      if (
        !absolutePath.startsWith(`${registryRoot}${path.sep}`) &&
        absolutePath !== registryRoot
      ) {
        errors.push(
          `Registry item ${item.name} references a file outside registry/: ${relativePath}`,
        );
        continue;
      }

      try {
        const source = await fs.readFile(absolutePath, "utf-8");
        if (!installableItem) {
          continue;
        }

        const imports = collectExternalImports(source);
        for (const packageName of imports) {
          if (implicitlyAvailablePackages.has(packageName)) continue;
          if (!declaredPackages.has(packageName)) {
            errors.push(
              `Registry item ${item.name} is missing dependency ${packageName} required by ${relativePath}`,
            );
          }
        }
      } catch {
        errors.push(
          `Registry item ${item.name} references a missing file: ${relativePath}`,
        );
      }
    }
  }

  for (const cycle of findDependencyCycles(dependencyGraph)) {
    errors.push(`Registry dependency cycle detected: ${cycle.join(" -> ")}`);
  }

  if (errors.length > 0) {
    console.error("Registry source validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${items.length} registry source items in ${appRoot}`);
}

await main();
