"use client";

import {
  FileTree,
  type FileTreeElement,
} from "@/registry/components/unlumen/file-tree";

const elements: FileTreeElement[] = [
  {
    id: "src",
    type: "folder",
    name: "src",
    children: [
      {
        id: "components",
        type: "folder",
        name: "components",
        children: [
          {
            id: "ui",
            type: "folder",
            name: "ui",
            children: [
              { id: "button", name: "button.tsx", highlight: true },
              { id: "card", name: "card.tsx", highlight: true },
              { id: "modal", name: "modal.tsx" },
              { id: "input", name: "input.tsx" },
            ],
          },
          {
            id: "layout",
            type: "folder",
            name: "layout",
            children: [
              { id: "header", name: "header.tsx" },
              { id: "footer", name: "footer.tsx" },
              { id: "sidebar", name: "sidebar.tsx" },
            ],
          },
        ],
      },
      {
        id: "app",
        type: "folder",
        name: "app",
        children: [
          { id: "layout", name: "layout.tsx", highlight: true },
          { id: "page", name: "page.tsx", highlight: true },
          {
            id: "api",
            type: "folder",
            name: "api",
            children: [
              {
                id: "users",
                type: "folder",
                name: "users",
                children: [{ id: "route", name: "route.ts" }],
              },
              {
                id: "posts",
                type: "folder",
                name: "posts",
                children: [{ id: "route", name: "route.ts" }],
              },
            ],
          },
        ],
      },
      {
        id: "lib",
        type: "folder",
        name: "lib",
        children: [
          { id: "utils", name: "utils.ts" },
          {
            id: "hooks",
            type: "folder",
            name: "hooks",
            children: [
              { id: "useAuth", name: "useAuth.ts" },
              { id: "useTheme", name: "useTheme.ts" },
            ],
          },
          {
            id: "services",
            type: "folder",
            name: "services",
            children: [
              { id: "api", name: "api.ts", highlight: true },
              { id: "auth", name: "auth.ts" },
            ],
          },
        ],
      },
      {
        id: "styles",
        type: "folder",
        name: "styles",
        children: [
          { id: "globals", name: "globals.css" },
          { id: "theme", name: "theme.css" },
        ],
      },
    ],
  },
  {
    id: "public",
    type: "folder",
    name: "public",
    children: [
      { id: "favicon", name: "favicon.ico" },
      {
        id: "images",
        type: "folder",
        name: "images",
        children: [
          { id: "logo", name: "logo.png" },
          { id: "banner", name: "banner.jpg" },
        ],
      },
    ],
  },
  {
    id: "config",
    type: "folder",
    name: "config",
    children: [
      { id: "package-json", name: "package.json" },
      { id: "tsconfig", name: "tsconfig.json" },
      { id: "nextconfig", name: "next.config.js" },
    ],
  },
  { id: "readme", name: "README.md" },
];

interface FileTreeDemoProps {
  highlightColor?: string;
  indentSize?: number;
  showIcons?: boolean;
}

export function FileTreeDemo({
  highlightColor,
  indentSize,
  showIcons,
}: FileTreeDemoProps) {
  return (
    <div className="w-64">
      <FileTree
        elements={elements}
        defaultOpenIds={["src", "app"]}
        highlightColor={highlightColor}
        indentSize={indentSize}
        showIcons={showIcons}
      />
    </div>
  );
}

export default FileTreeDemo;
