import { promises as fs } from "fs";
import path from "path";
import {
  generatedIndexPath,
  generatedRegistryPath,
  getRegistryItemsFromFolder,
  isPremiumItem,
  normalizeRegistryDependency,
  pathExists,
  publicRegistryRoot,
} from "./lib/registry-utils.mts";

type GeneratedRegistryItem = {
  name: string;
  files?: Array<{ content?: string }>;
  registryDependencies?: string[];
};

function isExternalRegistryDependency(dependency: string): boolean {
  return /^https?:\/\//.test(dependency);
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

function hasUnresolvedRegistryImports(content: string | undefined): boolean {
  return Boolean(
    content &&
      (content.includes("@/registry/") || content.includes("@workspace/ui/")),
  );
}

async function main() {
  const errors: string[] = [];

  if (!(await pathExists(generatedRegistryPath))) {
    console.error(`Generated registry not found: ${generatedRegistryPath}`);
    process.exit(1);
  }

  const generatedRegistry = JSON.parse(
    await fs.readFile(generatedRegistryPath, "utf-8"),
  ) as { items?: GeneratedRegistryItem[] };

  const generatedItems = generatedRegistry.items ?? [];
  const generatedItemMap = new Map<string, GeneratedRegistryItem>();
  for (const item of generatedItems) {
    if (generatedItemMap.has(item.name)) {
      errors.push(`Generated registry contains duplicate item ${item.name}`);
      continue;
    }
    generatedItemMap.set(item.name, item);
  }

  const sourceItems = await getRegistryItemsFromFolder();
  const sourceNames = new Set(sourceItems.map((item) => item.name));

  for (const sourceItem of sourceItems) {
    if (!generatedItemMap.has(sourceItem.name)) {
      errors.push(`Generated registry is missing item ${sourceItem.name}`);
      continue;
    }

    const generatedItem = generatedItemMap.get(sourceItem.name);
    if (!generatedItem) continue;

    for (const dependencyName of generatedItem.registryDependencies ?? []) {
      const normalizedDependency = toLocalRegistryDependency(
        dependencyName,
        sourceNames,
      );
      if (!normalizedDependency) {
        continue;
      }

      if (!generatedItemMap.has(normalizedDependency)) {
        errors.push(
          `Generated registry item ${sourceItem.name} references missing dependency ${normalizedDependency}`,
        );
      }
    }

    const filePath = path.join(publicRegistryRoot, `${sourceItem.name}.json`);
    if (isPremiumItem(sourceItem.name)) {
      if ((generatedItem.files?.length ?? 0) !== 0) {
        errors.push(
          `Premium registry item ${sourceItem.name} should expose no files in registry.json`,
        );
      }
      if (await pathExists(filePath)) {
        errors.push(
          `Premium registry item ${sourceItem.name} leaked a public JSON artifact`,
        );
      }
      continue;
    }

    if (!(await pathExists(filePath))) {
      errors.push(`Generated JSON artifact is missing for ${sourceItem.name}`);
    }
  }

  const generatedFiles = await fs.readdir(publicRegistryRoot);
  for (const fileName of generatedFiles) {
    if (!fileName.endsWith(".json") || fileName === "registry.json") continue;

    const itemName = fileName.replace(/\.json$/, "");
    if (isPremiumItem(itemName)) {
      errors.push(`Premium artifact should not exist in public/r: ${fileName}`);
      continue;
    }

    if (!sourceNames.has(itemName) && itemName !== "index") {
      errors.push(
        `Generated artifact has no source registry item: ${fileName}`,
      );
    }

    const generatedItem = JSON.parse(
      await fs.readFile(path.join(publicRegistryRoot, fileName), "utf-8"),
    ) as { files?: Array<{ content?: string }> };

    for (const file of generatedItem.files ?? []) {
      if (hasUnresolvedRegistryImports(file.content)) {
        errors.push(
          `Generated artifact ${fileName} still contains unresolved registry imports`,
        );
        break;
      }
    }
  }

  if (!(await pathExists(generatedIndexPath))) {
    errors.push(`Generated registry index is missing: ${generatedIndexPath}`);
  } else {
    const generatedIndex = await fs.readFile(generatedIndexPath, "utf-8");
    if (generatedIndex.includes("@workspace/ui/")) {
      errors.push(
        "Generated registry index still contains @workspace/ui imports",
      );
    }
  }

  if (errors.length > 0) {
    console.error("Generated registry validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated generated registry artifacts in ${publicRegistryRoot}`,
  );
}

await main();
