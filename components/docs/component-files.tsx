"use client";

import { index } from "@/__registry__";
import { resolveRegistryDeps } from "@/lib/resolve-registry-deps";
import { cn } from "@workspace/ui/lib/utils";
import {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
} from "@/components/docs/files";

interface ComponentFilesProps {
  /** Registry component name — e.g. "tilt-card" */
  name: string;
  className?: string;
}

// ─── Tree-building helpers ─────────────────────────────────────────────────────

type TreeNode = {
  name: string;
  /** Full path segment so far (used as React key) */
  path: string;
  children: TreeNode[];
  isFile: boolean;
  /** Whether this is a file the user needs to create/copy */
  highlight: boolean;
};

function insertPath(root: TreeNode, segments: string[], highlight: boolean) {
  let current = root;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;
    const fullPath = segments.slice(0, i + 1).join("/");
    let child = current.children.find((c) => c.name === seg);
    if (!child) {
      child = {
        name: seg,
        path: fullPath,
        children: [],
        isFile: isLast,
        highlight: isLast && highlight,
      };
      current.children.push(child);
    }
    current = child;
  }
}

/** Sort: folders first (alphabetically), then files (alphabetically) */
function sortTree(node: TreeNode) {
  node.children.sort((a, b) => {
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  for (const child of node.children) sortTree(child);
}

function collectTargets(name: string): string[] {
  const component = index[name];
  if (!component) return [];

  const targets: string[] = [];

  // Main component files
  for (const file of component.files ?? []) {
    if (file.target) targets.push(file.target);
  }

  // Registry dependencies (recursive, includes transitive deps)
  for (const { entry } of resolveRegistryDeps(name)) {
    for (const file of entry.files ?? []) {
      if (file.target) targets.push(file.target);
    }
  }

  return targets;
}

/**
 * Normalize registry target paths into a clean project structure.
 * - `components/unlumen-ui/...` → `components/...`
 * - `components/ui/...` (manual deps) → kept as-is
 */
function normalizePath(target: string): string {
  return target.replace(/^components\/unlumen-ui\//, "components/");
}

/** Empty context folders shown as scaffolding. */
const CONTEXT_FOLDERS = ["lib", "public"];

function buildTree(targets: string[]): TreeNode {
  const root: TreeNode = {
    name: "your-project",
    path: "your-project",
    children: [],
    isFile: false,
    highlight: true,
  };

  // Insert real component files with normalized paths
  for (const target of targets) {
    const clean = normalizePath(target);
    insertPath(root, clean.split("/"), true);
  }

  // Add empty context folders
  for (const folder of CONTEXT_FOLDERS) {
    if (!root.children.some((c) => c.name === folder)) {
      root.children.push({
        name: folder,
        path: folder,
        children: [],
        isFile: false,
        highlight: false,
      });
    }
  }

  sortTree(root);
  return root;
}

// ─── Recursive renderer ────────────────────────────────────────────────────────

function RenderNode({
  node,
  defaultOpen,
}: {
  node: TreeNode;
  defaultOpen?: boolean;
}) {
  if (node.isFile) {
    return (
      <FileItem key={node.path} highlight={node.highlight}>
        {node.name}
      </FileItem>
    );
  }

  return (
    <FolderItem
      key={node.path}
      value={node.path}
      defaultOpen={defaultOpen ?? (node.highlight || hasHighlightedChild(node))}
    >
      <FolderTrigger>{node.name}</FolderTrigger>
      <FolderContent>
        {node.children.map((child) => (
          <RenderNode key={child.path} node={child} />
        ))}
      </FolderContent>
    </FolderItem>
  );
}

/** Returns true if any descendant is highlighted (i.e. a file to install). */
function hasHighlightedChild(node: TreeNode): boolean {
  for (const child of node.children) {
    if (child.highlight) return true;
    if (hasHighlightedChild(child)) return true;
  }
  return false;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ComponentFiles({ name, className }: ComponentFilesProps) {
  const targets = collectTargets(name);
  if (targets.length === 0) return null;

  const tree = buildTree(targets);

  return (
    <div
      className={cn(
        "my-4 rounded-xl border border-border/60 overflow-hidden",
        className,
      )}
    >
      <Files>
        <RenderNode node={tree} defaultOpen />
      </Files>
    </div>
  );
}
