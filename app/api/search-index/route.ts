import { NextResponse } from "next/server";
import { source } from "@/lib/source";

type SearchIndexItem = {
  id: string;
  label: string;
  href: string;
  category: string;
  description?: string;
  premium?: boolean;
  keywords: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  unlumen: "Unlumen UI",
  buttons: "Buttons",
  backgrounds: "Backgrounds",
  effects: "Effects",
  texts: "Texts",
  primitives: "Primitives",
  community: "Community",
};

function labelCategory(slug?: string): string {
  if (!slug) return "Components";
  return CATEGORY_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

function slugFromPath(path: string): string {
  return (
    path
      .replace(/\.mdx$/, "")
      .split("/")
      .at(-1) ?? path
  );
}

export function GET() {
  const docs: SearchIndexItem[] = source
    .getPages()
    .filter((page) => page.slugs[0] !== "ui")
    .map((page) => {
      const slug = slugFromPath(page.path);
      const category = labelCategory(page.slugs[0] ?? "docs");

      return {
        id: `docs:${page.url}`,
        label: page.data.title,
        href: page.url,
        category,
        description: page.data.description,
        premium: page.data.premium,
        keywords: [
          slug,
          page.data.title,
          category,
          page.data.description ?? "",
          page.data.premium ? "pro premium paid" : "free",
          "docs documentation guide",
        ],
      };
    });

  const refinedUi: SearchIndexItem[] = source
    .getPages()
    .filter((page) => page.slugs[0] === "ui" && page.slugs.length >= 3)
    .map((page) => {
      const slug = page.slugs.at(-1) ?? slugFromPath(page.path);
      const category = labelCategory(page.slugs[1]);

      return {
        id: `refined-ui:${page.url}`,
        label: page.data.title,
        href: page.url,
        category,
        description: page.data.description,
        premium: page.data.premium,
        keywords: [
          slug,
          page.data.title,
          category,
          page.data.description ?? "",
          page.data.premium ? "pro premium paid" : "free",
          "docs ui primitives",
        ],
      };
    });

  return NextResponse.json({
    components: [],
    docs,
    refinedUi,
  });
}
