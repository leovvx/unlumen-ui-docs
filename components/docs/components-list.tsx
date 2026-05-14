import { source } from "@/lib/source";
import { Button } from "@workspace/ui/components/ui/button";
import Link from "next/link";

// Human-readable labels for each category folder.
// Add an entry here when you create a new category folder under content/docs/components/.
const CATEGORY_LABELS: Record<string, string> = {
  unlumen: "Unlumen UI",
  buttons: "Buttons",
  backgrounds: "Backgrounds",
  effects: "Effects",
  texts: "Texts",
  primitives: "Primitives",
  community: "Community",
};

// Controls the display order of categories. Unknown categories appear at the end.
const CATEGORY_ORDER = [
  "unlumen",
  "buttons",
  "backgrounds",
  "effects",
  "texts",
  "primitives",
  "community",
];

function label(folder: string): string {
  return (
    CATEGORY_LABELS[folder] ?? folder.charAt(0).toUpperCase() + folder.slice(1)
  );
}

export function ComponentsList() {
  // All docs pages whose path is under components/ (excluding the index itself)
  const pages = source
    .getPages()
    .filter((p) => p.slugs[0] === "ui" && p.slugs.length >= 3);

  // Group by category folder (slugs[1])
  const grouped = new Map<string, typeof pages>();
  for (const page of pages) {
    const category = page.slugs[1];
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(page);
  }

  // Sort categories by CATEGORY_ORDER, unknowns at the end
  const sortedCategories = [...grouped.keys()].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="flex flex-col gap-10">
      {sortedCategories.map((category) => {
        const categoryPages = grouped.get(category)!;
        return (
          <section key={category}>
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              {label(category)}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryPages.map((page) => (
                <Button asChild key={page.url} variant="secondary">
                  <Link className="no-underline" href={page.url}>
                    {page.data.title}
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
