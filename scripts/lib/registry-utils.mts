import { promises as fs } from "fs";
import path from "path";

export type RegistryFile = {
  path: string;
  type?: string;
  target?: string;
  content?: string;
};

export type RegistryItem = {
  $schema?: string;
  name: string;
  type?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: Array<string | RegistryFile>;
  meta?: Record<string, unknown>;
};

export const appRoot = process.cwd();
export const registryRoot = path.join(appRoot, "registry");
export const publicRegistryRoot = path.join(appRoot, "public", "r");
export const generatedRegistryPath = path.join(
  publicRegistryRoot,
  "registry.json",
);
export const generatedIndexPath = path.join(
  appRoot,
  "__registry__",
  "index.tsx",
);

const premiumItems = new Set<string>();

export function isPremiumItem(name: string): boolean {
  if (premiumItems.has(name)) return true;
  if (name.startsWith("demo-") && premiumItems.has(name.slice(5))) return true;
  return false;
}

export function normalizeRegistryDependency(dependency: string): string {
  return dependency.replace(/^@unlumen-ui\//, "");
}

export function getGalleryComponentNames(): string[] {
  return [];
}

export function getRegistryFilePath(file: string | RegistryFile): string {
  return typeof file === "string" ? file : file.path;
}

export function resolveFromAppRoot(filePath: string): string {
  return path.resolve(appRoot, filePath);
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getRegistryItemsFromFolder(
  dir = registryRoot,
): Promise<RegistryItem[]> {
  const items: RegistryItem[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;

    const registryItemPath = path.join(fullPath, "registry-item.json");
    if (await pathExists(registryItemPath)) {
      const content = await fs.readFile(registryItemPath, "utf-8");
      const item = JSON.parse(content) as RegistryItem;
      if (item.$schema) {
        delete item.$schema;
      }
      items.push(item);
      continue;
    }

    const subItems = await getRegistryItemsFromFolder(fullPath);
    items.push(...subItems);
  }

  return items;
}
