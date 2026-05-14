"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpen01Icon as BookOpen,
  PuzzleIcon as Component,
  Home01Icon as Home,
  Moon02Icon as Moon,
  RocketIcon as Rocket,
  Search01Icon as Search,
  Sun03Icon as Sun,
  ComputerIcon as Monitor,
  SparklesIcon as Sparkles,
  MagicWand01Icon as Wand2,
  Github01Icon as Github,
} from "hugeicons-react";
const SearchIcon = Search;

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ShimmeringText } from "@/registry/primitives/texts/shimmering";
import { cn } from "@workspace/ui/lib/utils";

type CommandMenuProps = {
  placeholder?: string;
  triggerLabel?: string;
  className?: string;
};

type SearchIndexItem = {
  id: string;
  label: string;
  href: string;
  category: string;
  description?: string;
  premium?: boolean;
  keywords: string[];
};

type SearchIndex = {
  components: SearchIndexItem[];
  docs: SearchIndexItem[];
  refinedUi: SearchIndexItem[];
};

const NAVIGATION_ITEMS = [
  {
    label: "Home",
    href: "https://ui.unlumen.com",
    icon: Home,
    keywords: ["home", "main", "accueil"],
  },
  {
    label: "Documentation",
    href: "/installation",
    icon: BookOpen,
    keywords: ["docs", "documentation", "guide", "getting started", "install"],
  },
  {
    label: "primitives",
    href: "/ui",
    icon: Component,
    keywords: ["ui", "library", "browse", "refined"],
  },
  {
    label: "Components",
    href: "https://ui.unlumen.com/components",
    icon: Sparkles,
    keywords: ["components", "gallery", "browse", "registry"],
  },
  {
    label: "Pricing",
    href: "https://ui.unlumen.com/pricing",
    icon: Rocket,
    keywords: ["pricing", "pro", "premium", "upgrade"],
  },
];

export function CommandMenu({
  placeholder = "Search components, pages, actions...",
  triggerLabel = "Search components...",
  className,
}: CommandMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [searchIndex, setSearchIndex] = React.useState<SearchIndex | null>(
    null,
  );
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (!open || searchIndex) return;

    const controller = new AbortController();

    fetch("/docs/api/search-index", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load search index");
        return response.json() as Promise<SearchIndex>;
      })
      .then(setSearchIndex)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
        setSearchIndex({ components: [], docs: [], refinedUi: [] });
      });

    return () => controller.abort();
  }, [open, searchIndex]);

  // Delay showing commands after dialog opens
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

  // ⌘K keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down, { capture: true });
    return () =>
      document.removeEventListener("keydown", down, { capture: true });
  }, [pathname]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {/* Trigger button for Hero / Header */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg  bg-surface  px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 transition-colors w-full max-w-sm cursor-pointer",
          className,
        )}
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left">{triggerLabel}</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} className="bg-surface">
        <CommandInput placeholder={placeholder} />
        <div
          className="transition-all  duration-300 ease-out overflow-hidden"
          style={{
            maxHeight: showContent ? "400px" : "0px",
            opacity: showContent ? 1 : 0,
          }}
        >
          <CommandList>
            <CommandEmpty>
              <ShimmeringText
                className="text-sm font-mono"
                text="No results found."
              />
            </CommandEmpty>

            <CommandGroup heading="Navigation">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    onSelect={() =>
                      runCommand(() => {
                        if (item.href.startsWith("http")) {
                          window.location.href = item.href;
                          return;
                        }
                        router.push(item.href);
                      })
                    }
                    keywords={item.keywords}
                  >
                    <Icon className="mr-2 size-4" />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Documentation">
              {searchIndex?.docs.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  keywords={[
                    item.label,
                    item.category,
                    item.description ?? "",
                    ...item.keywords,
                    item.premium ? "pro premium paid" : "free",
                  ]}
                >
                  <BookOpen className="mr-2 size-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Components">
              {searchIndex?.components.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  keywords={[
                    item.label,
                    item.category,
                    item.description ?? "",
                    ...item.keywords,
                    item.premium ? "pro premium paid" : "free",
                  ]}
                >
                  <Wand2 className="mr-2 size-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="primitives">
              {searchIndex?.refinedUi.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  keywords={[
                    item.label,
                    item.category,
                    item.description ?? "",
                    ...item.keywords,
                    item.premium ? "pro premium paid" : "free",
                  ]}
                >
                  <Component className="mr-2 size-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Theme">
              <CommandItem
                onSelect={() => runCommand(() => setTheme("light"))}
                keywords={["light", "bright", "white", "day"]}
              >
                <Sun className="mr-2 size-4" />
                Light Mode
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme("dark"))}
                keywords={["dark", "night", "black"]}
              >
                <Moon className="mr-2 size-4" />
                Dark Mode
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme("system"))}
                keywords={["system", "auto", "os", "default"]}
              >
                <Monitor className="mr-2 size-4" />
                System Theme
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Links">
              <CommandItem
                onSelect={() =>
                  runCommand(() =>
                    window.open(
                      "https://github.com/wicki-leonard-emf/unlumen-ui-pv",
                      "_blank",
                    ),
                  )
                }
                keywords={["github", "source", "code", "repo"]}
              >
                <Github className="mr-2 size-4" />
                GitHub
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/installation"))}
                keywords={["get started", "start", "begin", "install"]}
              >
                <Rocket className="mr-2 size-4" />
                Get Started
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
