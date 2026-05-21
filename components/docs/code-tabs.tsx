"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@workspace/ui/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
  type TabsProps,
} from "@/registry/primitives/tabs";
import { CopyButton } from "@/registry/primitives/copy";

type CodeTabsProps = {
  codes: Record<string, string>;
  lang?: string;
  themes?: { light: string; dark: string };
  copyButton?: boolean;
  onCopiedChange?: (copied: boolean, content?: string) => void;
} & Omit<TabsProps, "children">;

function CodeTabs({
  codes,
  lang = "bash",
  themes = {
    light: "github-light",
    dark: "github-dark",
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  onCopiedChange,
  ...props
}: CodeTabsProps) {
  const { resolvedTheme } = useTheme();

  const [highlightedCodes, setHighlightedCodes] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string>(
    value ?? defaultValue ?? Object.keys(codes)[0] ?? "",
  );

  React.useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import("shiki");
        const newHighlightedCodes: Record<string, string> = {};

        for (const [command, val] of Object.entries(codes)) {
          const highlighted = await codeToHtml(val, {
            lang,
            themes: {
              light: themes.light,
              dark: themes.dark,
            },
            defaultColor: resolvedTheme === "dark" ? "dark" : "light",
          });

          newHighlightedCodes[command] = highlighted;
        }

        setHighlightedCodes(newHighlightedCodes);
      } catch (error) {
        console.error("Error highlighting codes", error);
        setHighlightedCodes(codes);
      }
    }
    loadHighlightedCode();
  }, [resolvedTheme, lang, themes.light, themes.dark, codes]);

  return (
    <Tabs
      data-slot="install-tabs"
      className={cn(
        "w-full gap-0 rounded-xl overflow-hidden border-0 bg-surface",
        className,
      )}
      {...props}
      value={selectedCode}
      onValueChange={(val) => {
        setSelectedCode(val);
        onValueChange?.(val);
      }}
    >
      <div className="flex items-center justify-between px-3 h-10">
        <TabsList className="flex items-center gap-0.5">
          <TabsHighlight
            mode="parent"
            className="h-full rounded-md bg-accent"
            containerClassName="relative isolate flex items-center gap-0.5"
            transition={{ type: "spring", stiffness: 750, damping: 40 }}
          >
            {Object.keys(codes).map((code) => (
              <TabsHighlightItem key={code} value={code}>
                <TabsTrigger
                  value={code}
                  className="relative z-10 px-3 h-7 rounded-md text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
                >
                  {code}
                </TabsTrigger>
              </TabsHighlightItem>
            ))}
          </TabsHighlight>
        </TabsList>

        {copyButton && highlightedCodes && (
          <CopyButton
            content={codes[selectedCode]}
            size="xs"
            variant="ghost"
            className="-me-1 bg-transparent hover:bg-foreground/5 dark:hover:bg-foreground/10"
            onCopiedChange={onCopiedChange}
          />
        )}
      </div>

      <div className="p-1.5">
        <TabsContents
          data-slot="install-tabs-contents"
          className="rounded-lg bg-surface"
        >
          {highlightedCodes &&
            Object.entries(highlightedCodes).map(([code, val]) => (
              <TabsContent
                data-slot="install-tabs-content"
                key={code}
                className="w-full"
                value={code}
              >
                <div
                  className="w-full text-sm overflow-auto flex items-center p-4 [&>pre,_&_code]:!bg-transparent [&_code_.line]:!px-0 [&>pre,_&_code]:[background:transparent_!important] [&>pre,_&_code]:border-none [&_code]:!text-[13px]"
                  dangerouslySetInnerHTML={{ __html: val }}
                />
              </TabsContent>
            ))}
        </TabsContents>
      </div>
    </Tabs>
  );
}

export { CodeTabs, type CodeTabsProps };
